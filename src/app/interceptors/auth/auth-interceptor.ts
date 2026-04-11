import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let clone = req.clone({
    withCredentials: true
  })
  return next(clone);
};
