import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Intercepteur fonctionnel Angular (standalone).
 * Ajoute automatiquement le header Authorization: Bearer <token>
 * à chaque requête HTTP sortante.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // Cloner la requête avec le header Authorization si token présent
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 → session expirée, rediriger vers login
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      // 403 → accès refusé
      if (error.status === 403) {
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
