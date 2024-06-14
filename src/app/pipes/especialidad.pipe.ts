import { Pipe, PipeTransform } from '@angular/core';
import { EspecialidadService } from '../servicios/especialidad.service';
import { Especialidad } from '../clases/especialidad';
import { Observable, filter, map } from 'rxjs';

@Pipe({
  name: 'especialidad',
  standalone: true
})
export class EspecialidadPipe implements PipeTransform {

  constructor(private servEspecialidad: EspecialidadService) { }

  transform(value: string): Observable<string> {
    return this.servEspecialidad.especialidades.pipe(
      // Filtra el valor inicial para evitar procesarlo
      filter(especialidades => especialidades.length > 0),
      map((especialidades: Especialidad[]) => {
        const obraSocial = especialidades.find((os: Especialidad) => os.id === value);
        return obraSocial ? obraSocial.nombre : 'No encontrada';
      })
    );
  }

}
