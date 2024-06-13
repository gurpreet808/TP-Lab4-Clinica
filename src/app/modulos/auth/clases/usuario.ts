import { DisponibilidadEspecialidad } from "../../../clases/disponibilidad";

export interface Usuario {
    uid: string;
    email: string;
    clave: string;
    tipo: string;
    nombre: string;
    apellido: string;
    dni: number;
    edad: number;
    url_foto_1: string;
    fecha_alta: Date;
    fecha_modificacion: Date;
}

export interface Especialista extends Usuario {
    habilitado: boolean;
    especialidades: string[]; //Array de IDs de especialidades
    disponibilidades: DisponibilidadEspecialidad[];
}

export interface Paciente extends Usuario {
    url_foto_2: string;
    //guarda el id de la obra social
    obra_social: string;
}