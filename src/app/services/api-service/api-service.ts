import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthResponse, CreateUrlRequest, GoogleAuthRequest, LoginRequest, RegisterRequest, SessionStatusResponse, UrlItem, UrlRequest } from '../../Dtos/interfaces';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Construye las cabeceras con el JWT almacenado (si existe). */
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  // ── URLs ─────────────────────────────────────────────────────────────────

  /**
   * GET /urls
   * Obtiene todos los enlaces cortos del usuario autenticado.
   */
  getAllUrls(): Observable<UrlItem[]> {
    return this.http.get<UrlItem[]>(`${this.baseUrl}/urls`, {
      headers: this.authHeaders(),
    });
  }

  /**
   * GET /urls/{id}
   * Obtiene el detalle de un enlace por su ID.
   */
  getUrlById(id: number): Observable<UrlItem> {
    return this.http.get<UrlItem>(`${this.baseUrl}/urls/${id}`, {
      headers: this.authHeaders(),
    });
  }

  /**
   * POST /urls/create
   * Crea un nuevo enlace corto a partir de una URL larga.
   */
  createUrl(body: CreateUrlRequest): Observable<UrlItem> {
    return this.http.post<UrlItem>(`${this.baseUrl}/urls/create`, body, {
      headers: this.authHeaders(),
    }).pipe(
      map((response)=>({...response, shortUrl: environment.apiUrl +'/' + response.shortUrl}))
    );
  }

  /**
   * GET /urls/{id}/requests
   * Devuelve el historial de accesos (peticiones) de un enlace.
   */
  getUrlRequests(id: number): Observable<UrlRequest[]> {
    return this.http.get<UrlRequest[]>(
      `${this.baseUrl}/urls/${id}/requests`,
      { headers: this.authHeaders() }
    );
  }

  // ── Auth ─────────────────────────────────────────────────────────────────

  /**
   * POST /register
   * Registra un nuevo usuario en la plataforma.
   */
  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  /**
   * POST /login
   * Inicia sesión y obtiene el token JWT.
   */
  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  /**
   * GET /login
   * Verifica si la sesión actual sigue activa.
   */
  checkSession(): Observable<SessionStatusResponse> {
    return this.http.get<SessionStatusResponse>(`${this.baseUrl}/login`, {
      headers: this.authHeaders(),
    });
  }

  /**
   * POST /google/auth
   * Inicia sesión mediante Google OAuth.
   * Envía el idToken obtenido del SDK de Google.
   */
  googleAuth(body: GoogleAuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/google/auth`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}