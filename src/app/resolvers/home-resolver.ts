import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';

export const homeResolver: ResolveFn<string> = (route, state) => {
  const authService = inject(AuthService)
  return authService.checkSession()
};