export interface Turno {
    id: string;
    id_paciente: string;
    id_especialista: string;
    estado: EstadoTurno;
    fecha: Date;
    hora: string;
    especialidad: string; //aqui se guarda el ID de la especialidad, el nombre se trae con pipe
    comentario: {
        autor: string;
        texto: string;
    };
}

export enum EstadoTurno {
    Pendiente = 1,
    Cancelado = 2,
    Rechazado = 3,
    Aceptado = 4,
    Realizado = 5
}