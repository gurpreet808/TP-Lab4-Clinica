import { Component } from '@angular/core';
import { TurnoListComponent } from '../../componentes/turno-list/turno-list.component';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [
    TurnoListComponent
  ],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.scss'
})
export class MisTurnosComponent {

}
