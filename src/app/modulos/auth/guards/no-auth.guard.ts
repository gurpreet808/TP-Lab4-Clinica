import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const servAuth = inject(AuthService);

  let logueado: boolean = false;

  try {
    logueado = await servAuth.IsLoggedIn();
  } catch (error) {
    console.error("Error AnonGuard:", error);
  }

  if (logueado) {
    // Redirige al usuario si está logueado
    router.navigate(['/']);
    return false;
  } else {
    // Permite el acceso si no está logueado
    return true;
  }
};