import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, map, skip } from 'rxjs';
import { CollectionReference, DocumentData, DocumentReference, Firestore, Query, Timestamp, collection, collectionData, deleteDoc, doc, getDocs, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { Turno, TURNO_DEFAULT } from '../clases/turno';
import { Disponibilidad, DisponibilidadEspecialidad } from '../clases/disponibilidad';
import { DisponibilidadService } from './disponibilidad.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  turnos: BehaviorSubject<Turno[]> = new BehaviorSubject<Turno[]>([]);
  duracion: number = 30;
  firstRun: boolean = true;

  private readonly pathUrl: string = 'turnos';
  private readonly rootRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, this.pathUrl);

  constructor(private firestore: Firestore, public servDisponibilidad: DisponibilidadService) {
    this.CargarSubscripcion();
  }

  TraerTodos(): Observable<Turno[]> {
    let _query: Query<Turno, DocumentData> = query(
      this.rootRef,
      orderBy('fecha', 'desc')
    ) as Query<Turno, DocumentData>;
    return collectionData<Turno>(_query, { idField: 'id' }).pipe(
      map(
        (turnos: Turno[]) => {
          return turnos.map(
            (turno: Turno) => {
              return { ...turno, fecha: this.HandleDate(turno.fecha) }
            }
          )
        }
      )
    );
  }

  TraerTurnosOcupadosPorEspecialistaEntreFechas(fechaInicio: Date, fechaFin: Date, id_especialista: string): Observable<Turno[]> {
    let _query = query(this.rootRef, where('fecha', '>=', fechaInicio), where('fecha', '<=', fechaFin), where('id_especialista', '==', id_especialista)) as Query<Turno, DocumentData>;
    return collectionData<Turno>(_query, { idField: 'id' }).pipe(
      map(
        (turnos: Turno[]) => {
          return turnos.map(
            (turno: Turno) => {
              return { ...turno, fecha: this.HandleDate(turno.fecha) }
            }
          )
        }
      )
    );
  }

  TraerTurnosPorPaciente(id_paciente: string): Observable<Turno[]> {
    let _query = query(this.rootRef, where('id_paciente', '==', id_paciente)) as Query<Turno, DocumentData>;
    return collectionData<Turno>(_query, { idField: 'id' }).pipe(
      map(
        (turnos: Turno[]) => {
          return turnos.map(
            (turno: Turno) => {
              return { ...turno, fecha: this.HandleDate(turno.fecha) }
            }
          )
        }
      )
    );
  }

  TraerTurnosPorEspecialista(id_especialista: string): Observable<Turno[]> {
    let _query = query(this.rootRef, where('id_especialista', '==', id_especialista)) as Query<Turno, DocumentData>;
    return collectionData<Turno>(_query, { idField: 'id' }).pipe(
      map(
        (turnos: Turno[]) => {
          return turnos.map(
            (turno: Turno) => {
              return { ...turno, fecha: this.HandleDate(turno.fecha) }
            }
          )
        }
      )
    );
  }

  CargarSubscripcion(): void {
    this.TraerTodos().subscribe(
      (turnos: Turno[]) => {
        this.turnos.next(turnos);
        this.firstRun = false;
        //console.log("Obras sociales cargadas", "Cant: " + this.turnos.value.length);
      }
    );
  }

  async Nuevo(_turno: Turno): Promise<void> {
    _turno = await this.validarDatosTurno(_turno);

    let docRef: DocumentReference<DocumentData, DocumentData> = doc(this.rootRef);
    _turno.id = docRef.id;

    return setDoc(docRef, _turno);
  }

  async Modificar(_turno: Turno): Promise<void> {
    _turno = await this.validarDatosTurno(_turno);

    let docRef = doc(this.rootRef, _turno.id);
    return setDoc(docRef, _turno);
  }

  Borrar(id: string): Promise<void> {
    if (id == null) {
      return Promise.reject('ID nulo');
    };

    if (id == "") {
      return Promise.reject('ID vacío');
    };

    let docRef = doc(this.rootRef, id);
    return deleteDoc(docRef);
  }

  async validarDatosTurno(_turno: Turno): Promise<Turno> {
    if (_turno === null) {
      throw new Error("Turno nula");
    }

    //Realizar las validaciones necesarias

    return _turno;
  }

  TurnosPorFecha(fecha: Date): Turno[] {
    return this.turnos.value.filter(turno => turno.fecha == fecha);
  }

  TurnosEntreFechas(fecha_inicio: Date, fecha_fin: Date): Turno[] {
    return this.turnos.value.filter(turno => turno.fecha >= fecha_inicio && turno.fecha <= fecha_fin);
  }

  SonTurnosIguales(turno1: Turno, turno2: Turno): boolean {
    return (
      turno1.id_paciente == turno2.id_paciente &&
      turno1.id_especialista == turno2.id_especialista &&
      (turno1.fecha == turno2.fecha && turno1.hora == turno2.hora)
    );
  }

  sonTurnosMismaFechaHora(turno1: Turno, turno2: Turno): boolean {
    return turno1.fecha == turno2.fecha && turno1.hora == turno2.hora;
  }

  ClonarTurno(turno: Turno): Turno {
    let _turno: Turno = JSON.parse(JSON.stringify(turno));
    _turno.fecha = new Date(turno.fecha);
    return _turno;
  }

  HandleDate(fecha: any): Date {
    if (typeof fecha === 'string') {
      return new Date(fecha);
    }

    if (fecha.seconds !== undefined) {
      return new Date(fecha.seconds * 1000);
    }

    return fecha;
  }

  TimestampToDate(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }

  async GenerarTurnos(id_paciente: string, id_especialista: string, id_especialidad: string, disponibilidades_especialista: DisponibilidadEspecialidad[], cantidad_dias: number) {
    let _turnos: Turno[] = [];

    let _fecha_inicio: Date = new Date();
    //_fecha_inicio = new Date("11/30/2023 10:50:00");

    if (_fecha_inicio.getMinutes() > 30) {
      _fecha_inicio.setHours(_fecha_inicio.getHours() + 1, 0, 0, 0);
    }
    _fecha_inicio.setHours(_fecha_inicio.getHours() + 1, 0, 0, 0);

    let _fecha_fin: Date = new Date(_fecha_inicio);
    let _fecha_iteracion: Date = new Date(_fecha_inicio);
    _fecha_fin.setDate(_fecha_inicio.getDate() + cantidad_dias);

    //console.log(_fecha_fin);
    //console.log(_fecha_inicio.getDate());
    //console.log(_fecha_inicio.getDay());

    for (let _numero_de_dia = 0; _numero_de_dia < cantidad_dias + 1; _numero_de_dia++) {
      //console.log(_fecha_iteracion.getDate(), _fecha_iteracion.getDay());

      for (const disponibilidad of disponibilidades_especialista) {
        if (disponibilidad.especialidad == id_especialidad) {
          if (disponibilidad.dia == _fecha_iteracion.getDay()) {
            let disponibilidades_clinica_dia: Disponibilidad[] = await this.servDisponibilidad.DisponibilidadesClinicaPorDia(_fecha_iteracion.getDay());

            if (disponibilidades_clinica_dia.length > 0) {
              let hora_inicio: number = disponibilidad.hora_inicio;
              let hora_fin: number = disponibilidad.hora_fin;

              if (_fecha_iteracion.getDate() === _fecha_inicio.getDate()) {
                if (_fecha_inicio.getHours() > hora_inicio) {
                  hora_inicio = _fecha_inicio.getHours();
                }
              }

              for (let hora = hora_inicio; hora < hora_fin; hora++) {
                // Crear una nueva instancia de Date para cada turno
                const fechaTurno = new Date(_fecha_iteracion);
                fechaTurno.setHours(hora, 0, 0, 0);

                let _turno_model = this.ClonarTurno(TURNO_DEFAULT);

                _turno_model.id_especialista = id_especialista;
                _turno_model.id_paciente = id_paciente;
                _turno_model.estado = 1;
                _turno_model.fecha = fechaTurno;
                _turno_model.hora = hora.toString() + ':00';
                _turno_model.especialidad = id_especialidad;

                //console.log(disponibilidades_clinica_dia);

                for (const disponibilidad_clinica of disponibilidades_clinica_dia) {
                  if (hora >= disponibilidad_clinica.hora_inicio && hora < disponibilidad_clinica.hora_fin) {
                    _turnos.push(_turno_model);

                    let _turno: Turno = this.ClonarTurno(_turno_model);

                    const fechaTurno2 = new Date(fechaTurno);
                    fechaTurno2.setHours(hora, 30, 0, 0);
                    _turno.fecha = fechaTurno2;
                    _turno.hora = hora.toString() + ':30'
                    _turnos.push(_turno);
                    break;
                  }
                }

              }
            }
          }
        }
      }

      _fecha_iteracion.setDate(_fecha_iteracion.getDate() + 1);
    }

    return _turnos;
  }

  async Ready(): Promise<boolean> {
    if (this.firstRun) {
      //console.log("firstRun TurnoService READY");
      await firstValueFrom(this.turnos.pipe(skip(1)));
    }

    return !this.firstRun;
  }
}
