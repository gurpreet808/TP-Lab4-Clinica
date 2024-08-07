import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TurnoService } from '../../servicios/turno.service';
import { Turno } from '../../clases/turno';
import { Subscription } from 'rxjs';
import { AsyncPipe, DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [
    KeyValuePipe,
    TitleCasePipe,
    DatePipe,
    NombreApellidoUsuarioPipe,
    AsyncPipe
  ],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.scss'
})
export class HistoriaClinicaComponent implements OnInit, OnDestroy {
  @Input() paciente_id: string | undefined;
  turnos: Turno[] = [];
  turnos_suscription: Subscription | undefined;
  @Output() Turnos: EventEmitter<Turno[]> = new EventEmitter<Turno[]>();

  constructor(public servTurno: TurnoService) { }

  ngOnInit(): void {
    if (this.paciente_id) {
      this.turnos_suscription = this.servTurno.TraerTurnosPorPacientePorEstado(this.paciente_id, 5).subscribe(
        (turnos: Turno[]) => {
          this.turnos = turnos;
          this.Turnos.emit(this.turnos);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.turnos_suscription) {
      this.turnos_suscription.unsubscribe();
    }
  }
}
