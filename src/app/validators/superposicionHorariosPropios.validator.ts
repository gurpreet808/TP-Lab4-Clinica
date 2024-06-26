import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Disponibilidad, DisponibilidadEspecialidad } from '../clases/disponibilidad';

export function superposicionHorariosPropios(disponibilidades: DisponibilidadEspecialidad[], disponibilidadEditada?: DisponibilidadEspecialidad): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    console.log('Ejecutando validación de superposición...');

    const diaControl = formGroup.get('dia');
    const horaInicioControl = formGroup.get('hora_inicio');
    const horaFinControl = formGroup.get('hora_fin');
    const dia = diaControl?.value;
    const horaInicio = horaInicioControl?.value;
    const horaFin = horaFinControl?.value;

    if (!dia || !horaInicio || !horaFin) {
      console.log('Faltan datos para la validación.');
      return null;
    }

    let superposicion: Disponibilidad | undefined;

    for (const disponibilidad of disponibilidades) {
      if (
        disponibilidad !== disponibilidadEditada &&
        disponibilidad.dia === dia &&
        (
          (horaInicio >= disponibilidad.hora_inicio && horaInicio < disponibilidad.hora_fin) ||
          (horaFin > disponibilidad.hora_inicio && horaFin <= disponibilidad.hora_fin) ||
          (horaInicio <= disponibilidad.hora_inicio && horaFin >= disponibilidad.hora_fin)
        )
      ) {
        console.log('Se encontró una superposición con:', disponibilidad);

        superposicion = disponibilidad;
      }
    }

    if (superposicion != undefined) {
      diaControl.setErrors({ superposicion: true });
      horaInicioControl.setErrors({ superposicion: true });
      horaFinControl.setErrors({ superposicion: true });

      return {
        superposicionHorarios: {
          mensaje: `Se solapan esos horarios para ese día de ${superposicion.hora_inicio}:00 a ${superposicion.hora_fin}:00 hs.`
        }
      };
    } else {
      diaControl.setErrors(null);
      horaInicioControl.setErrors(null);
      horaFinControl.setErrors(null);

      console.log('No se encontraron superposiciones.');
      return null;
    }

  };
}