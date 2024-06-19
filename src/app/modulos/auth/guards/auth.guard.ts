import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { AuthService } from '../servicios/auth.service';


export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const servAuth = inject(AuthService);
  const ROLES_PERMITIDOS = route.data['roles_permitidos'] as string[];

  if (!ROLES_PERMITIDOS || ROLES_PERMITIDOS.length === 0) {
    console.log('No se han definido roles permitidos para esta ruta. Acceso denegado.');
    router.navigate(['/']);
    return false;
  }

  let habilitado: boolean = false;
  let logueado: boolean = false;

  try {
    logueado = await servAuth.IsLoggedIn();
    if (logueado) {
      let usuario: Usuario | undefined = servAuth.usuarioActual.value;
      if (usuario) {
        habilitado = ROLES_PERMITIDOS.includes(usuario.tipo);
      }
    }
  } catch (error) {
    console.error("Error AuthGuard:", error);
  }
  //console.log("Valor habilitado", habilitado);

  if (!habilitado) {
    router.navigate(['/']);
  }

  return habilitado;
};