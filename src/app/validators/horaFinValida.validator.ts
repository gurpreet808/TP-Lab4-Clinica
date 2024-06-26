import { AbstractControl, FormGroup, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { DisponibilidadService } from '../servicios/disponibilidad.service';
import { inject } from '@angular/core';

export function horaFinValida(): AsyncValidatorFn {
  const disponibilidadService = inject(DisponibilidadService);

  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) {
      return null; // No validar si no está dentro de un FormGroup
    }

    const diaControl = formGroup.get('dia');
    const horaInicioControl = formGroup.get('hora_inicio');
    const horaFin = control.value;
    const dia = diaControl?.value;
    const horaInicio = horaInicioControl?.value;

    if (!horaFin || !dia) {
      return null; // No validar si la hora de fin o el día están vacíos
    }

    try {
      const disponibilidadClinica = await disponibilidadService.DisponibilidadTotalClinicaPorDia(dia);

      if (horaFin > disponibilidadClinica.hora_fin) {
        return { horaFinMayorClinica: { mensaje: `La clínica ese día termina de atender a las ${disponibilidadClinica.hora_fin}:00` } };
      }

      if (horaFin <= horaInicio) {
        return { horaFinMenorHoraInicio: { mensaje: 'La hora de fin no puede ser menor o igual a la hora de inicio.' } };
      }

    } catch (error) {
      console.error("Error al obtener la disponibilidad de la clínica:", error);
    }

    return null;
  };
}