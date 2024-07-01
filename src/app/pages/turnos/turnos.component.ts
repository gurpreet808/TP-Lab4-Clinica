import { Component } from '@angular/core';
import { TurnoListComponent } from '../../componentes/turno-list/turno-list.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    TurnoListComponent
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss'
})
export class TurnosComponent {

}
