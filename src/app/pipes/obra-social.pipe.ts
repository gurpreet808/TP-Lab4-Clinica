import { Pipe, PipeTransform } from '@angular/core';
import { ObraSocialService } from '../servicios/obra-social.service';
import { ObraSocial } from '../clases/obra-social';
import { Observable, filter, map } from 'rxjs';

@Pipe({
  name: 'obraSocial',
  standalone: true
})
export class ObraSocialPipe implements PipeTransform {

  constructor(private servObraSocial: ObraSocialService) { }

  transform(value: string): Observable<string> {
    return this.servObraSocial.obras_sociales.pipe(
      // Filtra el valor inicial para evitar procesarlo
      filter(obrasSociales => obrasSociales.length > 0),
      map((obrasSociales: ObraSocial[]) => {
        const obraSocial = obrasSociales.find((os: ObraSocial) => os.id === value);
        return obraSocial ? obraSocial.nombre : 'No encontrada';
      })
    );
  }

}