import { Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { authGuard } from './modulos/auth/guards/auth.guard';
import { noAuthGuard } from './modulos/auth/guards/no-auth.guard';

export const routes: Routes = [
    { path: '', component: BienvenidaComponent, data: { animation: 'fadeInLeft' } },
    { path: 'login', canActivate: [noAuthGuard], data: { animation: 'zoomInLeft' }, loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
    { path: 'registro', canActivate: [noAuthGuard], data: { animation: 'rotateInUpLeft' }, loadComponent: () => import('./pages/registro/registro.component').then(c => c.RegistroComponent) },
    { path: 'usuarios', canActivate: [authGuard], data: { roles_permitidos: ['admin'], animation: 'rollIn' }, loadComponent: () => import('./pages/usuarios/usuarios.component').then(c => c.UsuariosComponent) },
    { path: 'mi-perfil', canActivate: [authGuard], data: { roles_permitidos: ['admin', 'especialista', 'paciente'], animation: 'fadeInLeft' }, loadComponent: () => import('./pages/mi-perfil/mi-perfil.component').then(c => c.MiPerfilComponent) },
    { path: 'obras-sociales', canActivate: [authGuard], data: { roles_permitidos: ['admin'], animation: 'zoomInLeft' }, loadComponent: () => import('./pages/obras-sociales/obras-sociales.component').then(c => c.ObrasSocialesComponent) },
    { path: 'especialidades', canActivate: [authGuard], data: { roles_permitidos: ['admin'], animation: 'rotateInUpLeft' }, loadComponent: () => import('./pages/especialidades/especialidades.component').then(c => c.EspecialidadesComponent) },
    { path: 'solicitar-turno', canActivate: [authGuard], data: { roles_permitidos: ['paciente'], animation: 'rollIn' }, loadComponent: () => import('./pages/solicitar-turno/solicitar-turno.component').then(c => c.SolicitarTurnoComponent) },
    { path: 'mis-turnos', canActivate: [authGuard], data: { roles_permitidos: ['paciente', 'especialista'], animation: 'fadeInLeft' }, loadComponent: () => import('./pages/mis-turnos/mis-turnos.component').then(c => c.MisTurnosComponent) },
    { path: 'turnos', canActivate: [authGuard], data: { roles_permitidos: ['admin'], animation: 'zoomInLeft' }, loadComponent: () => import('./pages/mis-turnos/mis-turnos.component').then(c => c.MisTurnosComponent) },
    { path: 'pacientes', canActivate: [authGuard], data: { roles_permitidos: ['especialista'], animation: 'rollIn' }, loadComponent: () => import('./pages/pacientes/pacientes.component').then(c => c.PacientesComponent) },
    { path: 'informes', canActivate: [authGuard], data: { roles_permitidos: ['admin'], animation: 'rollIn' }, loadComponent: () => import('./pages/informes/informes.component').then(c => c.InformesComponent) },
    { path: '**', component: Error404Component }
];
