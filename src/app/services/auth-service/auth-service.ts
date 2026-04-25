import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  Observable,
  catchError,
  defer,
  finalize,
  from,
  map,
  shareReplay,
  switchMap,
  throwError,
  tap,
} from 'rxjs';
import {
  AuthTokensResponse,
  RefreshTokenRequest,
  StoredAuthSession,
  User,
} from 'src/app/Dtos/interfaces';
import { environment } from 'src/environments/environment';
import { AuthSessionStorageService } from './auth-session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private refreshRequest$: Observable<string> | null = null;
  private sessionStorage = inject(AuthSessionStorageService);

  userAuth = signal('');

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    await this.sessionStorage.init();
    this.userAuth.set(this.sessionStorage.session()?.email ?? '');
  }

  register(body: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/api/auth/register`, body, {
      responseType: 'text',
    });
  }

  login(body: User): Observable<AuthTokensResponse> {
    return this.http
      .post<AuthTokensResponse>(`${this.baseUrl}/api/auth/login`, body)
      .pipe(switchMap((response) => this.persistSession(response)));
  }

  checkSession(): Observable<string> {
    return this.http
      .get(`${this.baseUrl}/api/auth/login`, {
        responseType: 'text',
      })
      .pipe(tap((userAuth) => this.userAuth.set(userAuth)));
  }

  googleAuth(body: string): Observable<AuthTokensResponse> {
    return this.http
      .post<AuthTokensResponse>(`${this.baseUrl}/api/auth/google`, {
        token: body,
      })
      .pipe(switchMap((response) => this.persistSession(response)));
  }

  logout(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return defer(() => from(this.clearSession()).pipe(map(() => '')));
    }

    const body: RefreshTokenRequest = { refreshToken };
    return this.http
      .post(`${this.baseUrl}/api/auth/logout`, body, {
        responseType: 'text',
      })
      .pipe(
        switchMap((response) =>
          from(this.clearSession()).pipe(map(() => response)),
        ),
        catchError((error) =>
          from(this.clearSession()).pipe(
            switchMap(() => throwError(() => error)),
          ),
        ),
      );
  }

  getAccessToken(): string {
    return this.sessionStorage.session()?.token ?? '';
  }

  getRefreshToken(): string {
    return this.sessionStorage.session()?.refreshToken ?? '';
  }

  shouldAttachToken(url: string): boolean {
    if (!url.startsWith(this.baseUrl)) {
      return false;
    }

    return ![
      '/api/auth/register',
      '/api/auth/google',
      '/api/auth/refresh',
      '/api/auth/confirm-email',
    ].some((path) => url.includes(path));
  }

  shouldRefresh(url: string): boolean {
    if (!url.startsWith(this.baseUrl)) {
      return false;
    }

    return ![
      '/api/auth/register',
      '/api/auth/google',
      '/api/auth/refresh',
      '/api/auth/logout',
      '/api/auth/confirm-email',
    ].some((path) => url.includes(path));
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const body: RefreshTokenRequest = { refreshToken };
    this.refreshRequest$ = this.http
      .post<AuthTokensResponse>(`${this.baseUrl}/api/auth/refresh`, body)
      .pipe(
        switchMap((response) =>
          from(this.storeSession(response)).pipe(map(() => response.token)),
        ),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
        shareReplay(1),
      );

    return this.refreshRequest$;
  }

  clearSession(): Promise<void> {
    this.userAuth.set('');
    return this.sessionStorage.clear();
  }

  private persistSession(
    response: AuthTokensResponse,
  ): Observable<AuthTokensResponse> {
    return from(this.storeSession(response)).pipe(map(() => response));
  }

  private async storeSession(response: AuthTokensResponse): Promise<void> {
    const session: StoredAuthSession = {
      ...response,
      storedAt: Date.now(),
    };

    await this.sessionStorage.setSession(session);
    this.userAuth.set(response.email);
  }
}
