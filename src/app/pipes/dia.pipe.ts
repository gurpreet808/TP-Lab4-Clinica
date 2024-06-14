import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dia',
  standalone: true
})
export class DiaPipe implements PipeTransform {

  transform(value: any): string {
    let dia: string = value.toString();

    switch (dia) {
      case '1':
        return 'Lunes';
      case '2':
        return 'Martes';
      case '3':
        return 'Miércoles';
      case '4':
        return 'Jueves';
      case '5':
        return 'Viernes';
      case '6':
        return 'Sábado';
      case '0':
        return 'Domingo';
      default:
        return value;
    }
  }

}
