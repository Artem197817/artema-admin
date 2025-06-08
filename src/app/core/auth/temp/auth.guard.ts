import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import {map} from 'rxjs';


export const authGuard: CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$().pipe(
    map(loggedIn => loggedIn ? true : router.parseUrl('/login'))
  );
};
