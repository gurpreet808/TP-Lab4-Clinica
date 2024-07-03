export interface Turno {
    id: string;
    id_paciente: string;
    id_especialista: string;
    estado: EstadoTurno;
    fecha: Date;
    hora: string;
    especialidad: string; //aqui se guarda el ID de la especialidad, el nombre se trae con pipe
    comentario: TurnoComentario;
    encuesta: TurnoEncuesta;
    calificacion: number;
}

export enum EstadoTurno {
    Pendiente = 1,
    Cancelado = 2,
    Rechazado = 3,
    Aceptado = 4,
    Finalizado = 5
}

export interface TurnoComentario {
    autor: string;
    texto: string;
}

export interface TurnoEncuesta {
    1: string;
    2: string;
    3: string;
}