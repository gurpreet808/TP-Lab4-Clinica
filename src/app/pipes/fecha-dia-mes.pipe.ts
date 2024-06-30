import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaDiaMes',
  standalone: true
})
export class FechaDiaMesPipe implements PipeTransform {

  transform(fecha: Date): string {
    let dia: string = fecha.getDate().toString();
    let mes: string = fecha.toLocaleString('es-AR', { month: 'long' });
    mes = mes.charAt(0).toUpperCase() + mes.slice(1);

    return `${dia} de ${mes}`;
  }

}
