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

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface SessionStatusResponse {
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface GoogleAuthRequest {
  idToken: string;
}