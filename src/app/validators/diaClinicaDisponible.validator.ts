import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { DisponibilidadService } from '../servicios/disponibilidad.service';
import { inject } from '@angular/core';

export function diaClinicaDisponible(): AsyncValidatorFn {
  const disponibilidadService = inject(DisponibilidadService);

  return async (control: AbstractControl) => {
    const dia = control.value;
    try {
      await disponibilidadService.DisponibilidadesClinicaPorDia(dia);
      return null;
    } catch (error) {
      return { diaClinicaDisponible: { mensaje: "La clínica no atiende ese día" } };
    };

  };
}