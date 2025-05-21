import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route) => {
  const path: string = route.routeConfig?.path || "";
  const auth: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const isAuthenticated = auth.isAuthenticated;

  if ((path === "map" || path !== "signin") && !isAuthenticated) {
    router.navigate(["/signin"]);
    return false;
  } else if ((path === "signin" || path !== "map") && isAuthenticated) {
    router.navigate(["/map"]);
    return false;
  } else {
    return true
  }
};
