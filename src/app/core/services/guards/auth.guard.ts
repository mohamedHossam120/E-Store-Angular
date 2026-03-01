import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(_platformId)) {
    if (localStorage.getItem('userToken') !== null) {
      return true; 
    }
  }

  _router.navigate(['/login']);
  return false;
};