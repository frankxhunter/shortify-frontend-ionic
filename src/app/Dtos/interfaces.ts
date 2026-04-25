export interface UrlItem {
  id: number;
  clickCounter: number;
  originalUrl: string;
  shortUrl: string;
  creationDate: string;
  name: string;
}

export interface CreateUrlRequest {
  url: string;
  name: string;
}

export interface UrlRequest {
  id: number;
  ip: string;
  userAgent: string;
  accessedAt: string;
}

export interface User {
  email: string;
  password: string;
}

export interface AuthTokensResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  refreshExpiresInMs: number;
  email: string;
}

export interface StoredAuthSession extends AuthTokensResponse {
  storedAt: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
