import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as UserRole[] | undefined;

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  return !roles?.length || roles.some((role) => auth.hasRole(role))
    ? true
    : router.createUrlTree(['/dashboard']);
};
