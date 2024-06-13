import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { Usuario } from '../../modulos/auth/clases/usuario';

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
export class NavBarComponent implements OnInit {

  menu_items: MenuItem[] = [
    { label: 'Home', icon: 'fa-solid fa-house', routerLink: '/' },
    { label: 'Usuarios', icon: 'fa-solid fa-user', routerLink: '/usuarios' },
    { label: 'Obras Sociales', icon: 'fa-solid fa-clinic-medical', routerLink: '/obras-sociales' },
    { label: 'Especialidades', icon: 'fa-solid fa-stethoscope', routerLink: '/especialidades' },
    { label: 'Turnos', icon: 'fa-solid fa-calendar-alt', routerLink: '/turnos' },
  ];

  constructor(public router: Router, public servAuth: AuthService) {
    this.servAuth.usuarioActual.subscribe(
      (usuario: Usuario | undefined) => {
        if (usuario) {
          //Logica para las opciones del navbar
        }
      }
    );
  }

  ngOnInit(): void {
  }

  Desloguear() {
    this.servAuth.LogOut();
    this.router.navigateByUrl('/login');
  }

}
