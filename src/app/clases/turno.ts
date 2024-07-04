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
    historia_clinica: HistoriaClinica;
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

export interface HistoriaClinica {
    altura: number;
    peso: number;
    temperatura: number;
    "presión": number;
    [key: string]: number;
}

export const TURNO_DEFAULT: Turno = {
    id: 'new',
    id_paciente: '',
    id_especialista: '',
    estado: EstadoTurno.Pendiente,
    fecha: new Date(),
    hora: '',
    especialidad: '',
    comentario: {
        autor: '',
        texto: ''
    },
    encuesta: {
        1: '',
        2: '',
        3: ''
    },
    calificacion: 0,
    historia_clinica: {
        altura: 0,
        peso: 0,
        temperatura: 0,
        "presión": 0
    }
};