import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { GoogleAuthResponse, User } from 'src/app/Dtos/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  userAuth = signal('')


  register(body: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, body, {
      responseType: 'text'
    });
  }

  login(body: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, body, {
      responseType: 'text'
    }).pipe(
      tap(userAuth => this.userAuth.set(body.email))
    );
  }

  checkSession(): Observable<string> {
    return this.http.get(`${this.baseUrl}/login`, {
      responseType: 'text'
    }).pipe(
      tap(userAuth => this.userAuth.set(userAuth))
    );
  }

  googleAuth(body: string): Observable<GoogleAuthResponse> {
    return this.http.post<GoogleAuthResponse>(`${this.baseUrl}/auth/google`, {
      token: body
    }).pipe(
      tap(userAuth => this.userAuth.set(userAuth.email))
    );
  }

  logout(): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      responseType: 'text'
    }).pipe(
      tap(() => this.userAuth.set(''))
    );
  }
}
