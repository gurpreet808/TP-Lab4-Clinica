import { Component, OnInit } from '@angular/core';
import { UsuarioItemComponent } from '../../componentes/usuario-item/usuario-item.component';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { HistoriaClinicaComponent } from '../../componentes/historia-clinica/historia-clinica.component';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    UsuarioItemComponent,
    MisHorariosComponent,
    HistoriaClinicaComponent
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit {

  constructor(public servAuth: AuthService) { }

  ngOnInit(): void {
  }
}
