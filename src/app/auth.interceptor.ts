import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const credentials = btoa('gdejongh:password');
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Basic ${credentials}`)
  });
  return next(authReq);
};