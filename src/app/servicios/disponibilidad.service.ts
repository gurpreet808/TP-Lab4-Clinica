import { Injectable } from '@angular/core';
import { Disponibilidad, DisponibilidadEspecialidad } from '../clases/disponibilidad';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {

  disponibilidadesClinica: Disponibilidad[] = [
    {
      dia: 1,
      hora_inicio: 8,
      hora_fin: 19
    },
    {
      dia: 2,
      hora_inicio: 8,
      hora_fin: 19
    },
    {
      dia: 3,
      hora_inicio: 8,
      hora_fin: 19
    },
    {
      dia: 4,
      hora_inicio: 8,
      hora_fin: 19
    },
    {
      dia: 5,
      hora_inicio: 8,
      hora_fin: 19
    },
    {
      dia: 6,
      hora_inicio: 8,
      hora_fin: 14
    }
  ];

  constructor() {
  }

  async DisponibilidadesClinicaPorDia(dia: number): Promise<Disponibilidad[]> {
    const disponibilidades = this.disponibilidadesClinica.filter(d => d.dia === dia);

    if (disponibilidades.length === 0) {
      throw new Error('No hay disponibilidad para ese día');
    }

    return disponibilidades;
  }

  async DisponibilidadTotalClinicaPorDia(dia: number): Promise<Disponibilidad> {
    return this.DisponibilidadesClinicaPorDia(dia).then(
      (disponibilidades) => {
        const minHoraInicio = Math.min(...disponibilidades.map(d => d.hora_inicio));
        const maxHoraFin = Math.max(...disponibilidades.map(d => d.hora_fin));

        return { dia, hora_inicio: minHoraInicio, hora_fin: maxHoraFin };
      }
    ).catch(
      (error) => {
        throw new Error('No hay disponibilidad para ese día');
      }
    );
  }

  async DisponibilidadEspecialidadDeEspecialistaPorDia(_dia: number, _especialidad_id: string, _disponibilidades: DisponibilidadEspecialidad[]): Promise<DisponibilidadEspecialidad[]> {
    return _disponibilidades.filter(d => d.dia === _dia && d.especialidad === _especialidad_id);
  }
}
