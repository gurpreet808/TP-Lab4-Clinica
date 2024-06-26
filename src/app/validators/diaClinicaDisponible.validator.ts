import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { DisponibilidadService } from '../servicios/disponibilidad.service';
import { inject } from '@angular/core';

export function diaClinicaDisponible(): AsyncValidatorFn {
  const disponibilidadService = inject(DisponibilidadService);

  return async (control: AbstractControl) => {
    const dia = control.value;
    try {
      const disponibilidades = await disponibilidadService.DisponibilidadesClinicaPorDia(dia);
      return disponibilidades.some(d => d.dia === dia) ? null : { diaClinicaDisponible: { mensaje: "La clínica no atiende ese día" } };
    } catch (error) {
      return { diaClinicaDisponible: { mensaje: "La clínica no atiende ese día" } };
    };

  };
}