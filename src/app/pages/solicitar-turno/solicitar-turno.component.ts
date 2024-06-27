import { Component } from '@angular/core';
import { TurnoFormComponent } from '../../componentes/turno-form/turno-form.component';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [
    TurnoFormComponent
  ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.scss'
})
export class SolicitarTurnoComponent {

}
