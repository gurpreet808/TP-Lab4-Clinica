import { Component, Input, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { DatePipe, AsyncPipe } from '@angular/common';
import { EspecialidadPipe } from '../../pipes/especialidad.pipe';
import { FechaDiaMesPipe } from '../../pipes/fecha-dia-mes.pipe';
import { TurnoEstadoPipe } from '../../pipes/turno-estado.pipe';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';

@Component({
  selector: 'app-turno-item',
  standalone: true,
  imports: [
    DatePipe,
    AsyncPipe,
    EspecialidadPipe,
    NombreApellidoUsuarioPipe,
    TurnoEstadoPipe,
    FechaDiaMesPipe,
  ],
  templateUrl: './turno-item.component.html',
  styleUrl: './turno-item.component.scss'
})
export class TurnoItemComponent implements OnInit {

  @Input() turno: Turno | undefined;

  constructor() { }

  ngOnInit(): void {
  }
}
