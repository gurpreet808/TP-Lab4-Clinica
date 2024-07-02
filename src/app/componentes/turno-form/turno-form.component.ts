import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { EspecialidadService } from '../../servicios/especialidad.service';
import { DisponibilidadService } from '../../servicios/disponibilidad.service';
import { TurnoService } from '../../servicios/turno.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { MessageService } from 'primeng/api';
import { Especialista, Paciente } from '../../modulos/auth/clases/usuario';
import { Especialidad } from '../../clases/especialidad';
import { Turno } from '../../clases/turno';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { EspecialidadPipe } from '../../pipes/especialidad.pipe';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { FechaDiaMesPipe } from '../../pipes/fecha-dia-mes.pipe';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    AsyncPipe,
    EspecialidadPipe,
    FechaDiaMesPipe,
    JsonPipe
  ],
  templateUrl: './turno-form.component.html',
  styleUrl: './turno-form.component.scss'
})
export class TurnoFormComponent implements OnInit, OnDestroy {
  _paciente: Paciente | undefined;
  _especialidad: Especialidad | undefined;
  _especialista: Especialista | undefined;
  _fecha: Date | undefined;
  _hora: string | undefined;
  _turno: Turno | undefined;

  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  turnos_generados: Turno[] = [];
  fechas_disponibles: Date[] = []; //Array de fechas en formato "DD de MMMM" ej "09 de Septiembre"
  turnos_filtrados_fecha: Turno[] = []; //Array de turnos disponibles filtrados por la fecha seleccionada

  paciente_suscripcion: Subscription;
  especialidades_suscripcion: Subscription;
  especialistas_suscripcion: Subscription;
  turnos_ocupados_suscripcion: Subscription | undefined;

  ready: {
    pacientes: boolean,
    especialistas: boolean,
    especialidades: boolean
  } = {
      pacientes: false,
      especialistas: false,
      especialidades: false
    };

  constructor(
    public servAuth: AuthService,
    public servUsuario: UsuarioService,
    public servEspecialidad: EspecialidadService,
    public servDisponibilidad: DisponibilidadService,
    public servTurno: TurnoService,
    public servSpinner: SpinnerService,
    public messageService: MessageService,
  ) {
    this.servSpinner.showWithMessage('turno-form-init', "Cargando datos...");

    this.paciente_suscripcion = this.servUsuario.pacientes.subscribe(
      (_pacientes) => {
        this.pacientes = _pacientes;
        this.ready.pacientes = true;
      }
    );

    this.especialidades_suscripcion = this.servEspecialidad.especialidades.subscribe(
      (_especialidades) => {
        this.ready.especialidades = true;
        this.especialidades = _especialidades.filter((especialidad: Especialidad) => especialidad.valida);
        this.FiltrarEspecialistas();
      }
    );

    this.especialistas_suscripcion = this.servUsuario.especialistas.subscribe(
      (_especialistas) => {
        this.ready.especialistas = true;
        this.FiltrarEspecialistas();
      }
    );
  }

  ngOnInit(): void {
    if (this.servAuth.usuarioActual.value!.tipo == "paciente") {
      this.ElegirPaciente(this.servAuth.GetUsuarioAsPaciente()!);
    }

    this.servSpinner.hideWithMessage('turno-form-init');
  }

  ngOnDestroy(): void {
    this.paciente_suscripcion.unsubscribe();
    this.especialistas_suscripcion.unsubscribe();
    this.especialidades_suscripcion.unsubscribe();
    if (this.turnos_ocupados_suscripcion) {
      this.turnos_ocupados_suscripcion.unsubscribe();
    }
  }

  //Orden Paciente, Especialidad, Especialista, Dia, Hora

  ElegirPaciente(paciente: Paciente) {
    this._paciente = paciente;
    this._especialidad = undefined;
    this._especialista = undefined;
    this._fecha = undefined;
    this._hora = undefined;
    this.turnos_generados = [];
    this.turnos_filtrados_fecha = [];
  }

  CancelarPaciente() {
    this._paciente = undefined;
    this._especialidad = undefined;
    this._especialista = undefined;
    this._fecha = undefined;
    this._hora = undefined;
    this.turnos_generados = [];
    this.turnos_filtrados_fecha = []
  }

  ElegirEspecialidad(especialidad: Especialidad) {
    this._especialidad = especialidad;
    this._especialista = undefined;
    this._fecha = undefined;
    this._hora = undefined;
    this.turnos_generados = [];
    this.turnos_filtrados_fecha = []
    this.FiltrarEspecialistas();
  }

  CancelarEspecialidad() {
    this._especialidad = undefined;
    this._especialista = undefined;
    this._fecha = undefined;
    this._hora = undefined;
    this.turnos_generados = [];
    this.turnos_filtrados_fecha = []
  }

  ElegirEspecialista(especialista: Especialista) {
    this._especialista = especialista;
    this._fecha = undefined;
    this._hora = undefined;
    this.turnos_generados = [];
    this.turnos_filtrados_fecha = []
    this.generarTurnosDisponibles();
  }

  CancelarEspecialista() {
    this._especialista = undefined;
    this._fecha = undefined;
    this._hora = undefined;
    this.turnos_generados = [];
    this.turnos_filtrados_fecha = []
  }

  ElegirFecha(fecha: Date) {
    this._fecha = fecha;
    this.turnos_filtrados_fecha = this.turnos_generados.filter(
      (turno: Turno) => {
        return turno.fecha.getDate() === fecha.getDate() &&
          turno.fecha.getMonth() === fecha.getMonth() &&
          turno.fecha.getFullYear() === fecha.getFullYear();
      }
    );
    this._hora = undefined;
  }

  CancelarFecha() {
    this._fecha = undefined;
    this._hora = undefined;
  }

  ElegirHora(turno: Turno) {
    this._hora = turno.hora;
    this._turno = turno;
  }

  CancelarHora() {
    this._hora = undefined;
  }

  SolicitarTurno() {
    console.log(this._turno);

    if (this._turno) {
      this.servSpinner.showWithMessage('turno-form-solicitar-turno', "Solicitando turno...");

      this.servTurno.Nuevo(this._turno).then(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Turno solicitado' });
          this.CancelarEspecialidad();

          if (this.servAuth.usuarioActual.value!.tipo != "paciente") {
            this.CancelarPaciente();
          }
        }
      ).catch(
        (err) => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo solicitar el turno' });
        }
      ).finally(
        () => {
          this.servSpinner.hideWithMessage('turno-form-solicitar-turno');
        }
      );
    }
  }

  FiltrarEspecialistas() {
    this.servSpinner.showWithMessage('turno-form-filtrar-especialistas', "Filtrando especialistas datos...");

    this.especialistas = this.servUsuario.especialistas.value.filter(
      (especialista: Especialista) => {
        // Verificar si el especialista tiene la especialidad seleccionada
        const tieneEspecialidad = this._especialidad
          ? especialista.especialidades.includes(this._especialidad.id)
          : true; // Si no se ha seleccionado especialidad, mostrar todos los especialistas

        return especialista.habilitado && tieneEspecialidad && especialista.especialidades.some(
          (especialidadId: string) => {
            return this.servEspecialidad.especialidades.value.some(
              (especialidad: Especialidad) => {
                return especialidad.id === especialidadId && especialidad.valida
              }
            )
          }
        )
      }
    );

    if (this.ready.especialistas && this.ready.especialidades) {
      this.servSpinner.hideWithMessage('turno-form-filtrar-especialistas');
    }
  }

  private generarTurnosDisponibles() {
    this.servSpinner.showWithMessage('turno-form-generar-turnos', "Generando turnos...");
    let los_turnos: Turno[] = [];

    if (this._especialista && this._paciente && this._especialidad) {
      this.servTurno.GenerarTurnos(this._paciente.uid, this._especialista.uid, this._especialidad.id, this._especialista.disponibilidades, 15).then(
        (_turnos: Turno[]) => {
          //console.log(_turnos);

          this.turnos_ocupados_suscripcion = this.servTurno.TraerTurnosOcupadosPorEspecialistaEntreFechas(_turnos[0].fecha, _turnos[_turnos.length - 1].fecha, this._especialista!.uid).subscribe(
            (_turnos_ocupados: Turno[]) => {

              _turnos_ocupados.forEach(
                (turno: Turno) => {
                  turno.fecha = new Date((turno.fecha as any).seconds * 1000);
                }
              );

              //console.log(_turnos_ocupados);

              _turnos.forEach(
                (turno: Turno) => {
                  if (!_turnos_ocupados.some(turno_ocupado => turno_ocupado.fecha.getTime() === turno.fecha.getTime())) {
                    los_turnos.push(turno);

                    if (!this.fechas_disponibles.some(fecha =>
                      fecha.getDate() === turno.fecha.getDate() &&
                      fecha.getMonth() === turno.fecha.getMonth() &&
                      fecha.getFullYear() === turno.fecha.getFullYear()
                    )) {
                      this.fechas_disponibles.push(turno.fecha);
                    }
                  }
                }
              );

              this.turnos_generados = los_turnos;
            }
          );
        }
      ).catch(
        (err) => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron generar los turnos' });
        }
      ).finally(
        () => {
          this.servSpinner.hideWithMessage('turno-form-generar-turnos');
        }
      );
    }
  }
}