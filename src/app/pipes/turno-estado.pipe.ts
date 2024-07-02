import { Pipe, PipeTransform } from '@angular/core';
import { EstadoTurno } from '../clases/turno';

@Pipe({
  name: 'turnoEstado',
  standalone: true
})
export class TurnoEstadoPipe implements PipeTransform {

  transform(valor: number): string {
    switch (valor) {
      case EstadoTurno.Pendiente: return 'Pendiente';
      case EstadoTurno.Cancelado: return 'Cancelado';
      case EstadoTurno.Rechazado: return 'Rechazado';
      case EstadoTurno.Aceptado: return 'Aceptado';
      case EstadoTurno.Realizado: return 'Realizado';
      default: return 'Desconocido';
    }
  }

}
