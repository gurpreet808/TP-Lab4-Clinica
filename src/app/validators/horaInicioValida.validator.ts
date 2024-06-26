import { AbstractControl, FormGroup, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { DisponibilidadService } from '../servicios/disponibilidad.service';
import { inject } from '@angular/core';

export function horaInicioValida(): AsyncValidatorFn {
  const disponibilidadService = inject(DisponibilidadService);

  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) {
      return null; // No validar si no está dentro de un FormGroup
    }

    const diaControl = formGroup.get('dia');
    const horaFinControl = formGroup.get('hora_fin');
    const horaInicio = control.value;
    const dia = diaControl?.value;
    const horaFin = horaFinControl?.value;

    if (!horaInicio || !dia) {
      return null; // No validar si la hora de inicio o el día están vacíos
    }

    try {
      const disponibilidadClinica = await disponibilidadService.DisponibilidadTotalClinicaPorDia(dia);

      if (horaInicio < disponibilidadClinica.hora_inicio) {
        return { horaInicioMenorClinica: { mensaje: `La clínica ese día comienza a atender a las ${disponibilidadClinica.hora_inicio}:00` } };
      }

      if (horaFin != undefined || horaFin != null) {
        if (horaInicio >= horaFin) {
          return { horaInicioMayorHoraFin: { mensaje: 'La hora de inicio no puede ser mayor o igual a la hora de fin.' } };
        }

        if (horaFin && (horaFin - horaInicio) < 1) {
          return { duracionMinima: { mensaje: `La duración mínima debe ser de 1 hora. La hora de fin para ese día debe ser como mínimo las ${(horaInicio + 1)}:00` } };
        }
      }

    } catch (error) {
      console.error("Error al obtener la disponibilidad de la clínica:", error);
    }

    return null;
  };
}