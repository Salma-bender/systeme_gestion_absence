import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard qui autorise uniquement les TEACHER.
 * Redirige les ADMIN vers /dashboard.
 */
export const teacherGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.getRole() === 'TEACHER') {
    return true;
  }

  // Admin ou autre rôle → redirection dashboard
  router.navigate(['/dashboard']);
  return false;
};
