import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  console.log(`AuthGuard: Checking access for ${state.url}`);

  if (state.url === '/logout') {
    console.log('AuthGuard: Skipping auth check for /logout');
    return true;
  }

  const user = apiService.getUserProfile();
  if (user) {
    console.log('AuthGuard: User is authenticated');
    return true;
  } else {
    console.log('AuthGuard: User is not authenticated, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }
};
