import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const isLoginRequest =
    req.method !== 'GET' && req.url.includes('/api/auth/login');

  const request =
    authService.shouldAttachToken(req.url) && !isLoginRequest && accessToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 403 ||
        isLoginRequest ||
        !authService.shouldRefresh(req.url)
      ) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((token) =>
          next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ),
        ),
        catchError((refreshError) => {
          void authService.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
