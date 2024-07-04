import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { Usuario } from '../../modulos/auth/clases/usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {

  usuario_suscription: Subscription
  menu_items: MenuItem[] = [];

  constructor(public router: Router, public servAuth: AuthService) {
    this.usuario_suscription = this.servAuth.usuarioActual.subscribe(
      (usuario: Usuario | undefined) => {
        if (usuario) {
          switch (usuario.tipo) {
            case 'admin':
              this.menu_items = this.AdminOptions();
              break;
            case 'paciente':
              this.menu_items = this.PacienteOptions();
              break;
            case 'especialista':
              this.menu_items = this.EspecialistaOptions();
              break;
          }
        } else {
          this.menu_items = [];
        }
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.usuario_suscription.unsubscribe();
  }

  Desloguear() {
    this.servAuth.LogOut();
    this.router.navigateByUrl('/login');
  }

  AdminOptions(): MenuItem[] {
    return [
      { label: 'Home', icon: 'fa-solid fa-house', routerLink: '/' },
      { label: 'Usuarios', icon: 'fa-solid fa-users', routerLink: '/usuarios' },
      { label: 'Obras Sociales', icon: 'fa-solid fa-clinic-medical', routerLink: '/obras-sociales' },
      { label: 'Especialidades', icon: 'fa-solid fa-stethoscope', routerLink: '/especialidades' },
      { label: 'Turnos', icon: 'fa-solid fa-calendar-days', routerLink: '/turnos' },
      { label: 'Mi perfil', icon: 'fa-solid fa-user', routerLink: '/mi-perfil' }
    ];
  }

  PacienteOptions(): MenuItem[] {
    return [
      { label: 'Home', icon: 'fa-solid fa-house', routerLink: '/' },
      { label: 'Solicitar turno', icon: 'fa-regular fa-calendar-plus', routerLink: '/solicitar-turno' },
      { label: 'Mis turnos', icon: 'fa-solid fa-calendar-days', routerLink: '/mis-turnos' },
      { label: 'Mi perfil', icon: 'fa-solid fa-user', routerLink: '/mi-perfil' }
    ];
  }

  EspecialistaOptions(): MenuItem[] {
    return [
      { label: 'Home', icon: 'fa-solid fa-house', routerLink: '/' },
      { label: 'Mis Turnos', icon: 'fa-solid fa-calendar-days', routerLink: '/mis-turnos' },
      { label: 'Pacientes', icon: 'fa-solid fa-user-friends', routerLink: '/pacientes' },
      { label: 'Mi perfil', icon: 'fa-solid fa-user', routerLink: '/mi-perfil' }
    ];
  }

}
