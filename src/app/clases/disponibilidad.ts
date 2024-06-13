export interface Disponibilidad {
    dia: number;
    hora_inicio: number;
    hora_fin: number;
}

export interface DisponibilidadEspecialidad extends Disponibilidad {
    especialidad: string;
}
