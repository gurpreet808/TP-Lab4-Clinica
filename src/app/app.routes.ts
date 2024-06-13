import { Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';

export const routes: Routes = [
    { path: '', component: BienvenidaComponent },
    { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
    { path: 'registro', loadComponent: () => import('./pages/registro/registro.component').then(c => c.RegistroComponent) },
    { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then(c => c.UsuariosComponent) },
    { path: 'obras-sociales', loadComponent: () => import('./pages/obras-sociales/obras-sociales.component').then(c => c.ObrasSocialesComponent) },
    { path: 'especialidades', loadComponent: () => import('./pages/especialidades/especialidades.component').then(c => c.EspecialidadesComponent) },
    { path: '**', component: Error404Component }
];
