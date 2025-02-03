import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route) => {
  const path: string = route.routeConfig?.path || "";
  const auth: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const isAuthenticated = auth.isAuthenticated;

  switch (path) {
    case "map": {
      if (!isAuthenticated) {
        router.navigate(["/signin"]);
        return false;
      }
      break;
    }

    case "signin": {
      if (isAuthenticated) {
        router.navigate(["/map"]);
        return false;
      }
      break;
    }
      
  
    default: {
      if (isAuthenticated) {
        router.navigate(["/map"]);
        return false;
      } else {
        router.navigate(["/signin"]);
        return false;
      }
    }
  }
  
  return true;
};

