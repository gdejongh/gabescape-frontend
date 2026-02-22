import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Only attach credentials to mutating requests when logged in
  if (auth.isLoggedIn && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${auth.credentials}`)
    });
    return next(authReq);
  }

  return next(req);
};