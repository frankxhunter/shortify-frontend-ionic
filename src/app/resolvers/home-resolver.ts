import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';
import { catchError, of } from 'rxjs';

export const homeResolver: ResolveFn<string> = (route, state) => {
  const authService = inject(AuthService)
  return authService.checkSession().pipe(
    catchError(() => of(''))
  )
};