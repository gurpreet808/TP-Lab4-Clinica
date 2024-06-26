import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DisponibilidadEspecialidad } from '../clases/disponibilidad';

export function superposicionHorariosPropios(disponibilidades: DisponibilidadEspecialidad[], disponibilidadEditada?: DisponibilidadEspecialidad): AsyncValidatorFn {
  return async (formGroup: AbstractControl) => {
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

    for (const disponibilidad of disponibilidades) {
      if (
        disponibilidad !== disponibilidadEditada && // Ignorar disponibilidad editada
        disponibilidad.dia === dia &&
        (
          (horaInicio >= disponibilidad.hora_inicio && horaInicio < disponibilidad.hora_fin) ||
          (horaFin > disponibilidad.hora_inicio && horaFin <= disponibilidad.hora_fin) ||
          (horaInicio <= disponibilidad.hora_inicio && horaFin >= disponibilidad.hora_fin)
        )
      ) {
        console.log('Se encontró una superposición con:', disponibilidad);

        // Establecer el error en el control hora_fin
        let errors = horaFinControl.errors || {};
        horaFinControl.setErrors({ ...errors, superposicionHorarios: true });
        return { superposicionHorarios: true }; // Error a nivel de formulario
      }
    }

    console.log('No se encontraron superposiciones.');
    return null;
  };
}