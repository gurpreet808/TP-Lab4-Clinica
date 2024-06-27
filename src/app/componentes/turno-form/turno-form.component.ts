import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    AsyncPipe,
    EspecialidadPipe,
  ], // Asegúrate de importar los módulos de PrimeNG que necesites
  templateUrl: './turno-form.component.html',
  styleUrl: './turno-form.component.scss'
})
export class TurnoFormComponent implements OnInit, OnDestroy {
  paciente: Paciente | undefined;
  especialistas: Especialista[] = [];
  especialista: Especialista | undefined;
  especialidades: Especialidad[] = [];
  especialidad: Especialidad | undefined;
  turno: Turno | undefined;
  turnos: Turno[] = [];

  paciente_suscripcion: Subscription;
  especialistas_suscripcion: Subscription;
  especialidades_suscripcion: Subscription;

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
        this.ready.pacientes = true;
      }
    );

    this.especialidades_suscripcion = this.servEspecialidad.especialidades.subscribe(
      (_especialidades) => {
        this.ready.especialidades = true;
        this.especialidades = _especialidades;
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
  }

  ElegirPaciente(_paciente: Paciente) {
    this.paciente = _paciente;
    this.especialista = undefined;
    this.especialidad = undefined;
    this.turnos = [];
  }

  CancelarPaciente() {
    this.paciente = undefined;
    this.especialista = undefined;
    this.especialidad = undefined;
    this.turnos = [];
  }

  ElegirEspecialista(_especialista: Especialista) {
    this.especialista = _especialista;
    this.especialidad = undefined;
    this.turnos = [];
  }

  CancelarEspecialista() {
    this.especialista = undefined;
    this.especialidad = undefined;
    this.turnos = [];
  }

  ElegirEspecialidad(_especialidad_id: string) {
    this.especialidad = this.servEspecialidad.especialidades.value.find(especialidad => especialidad.id === _especialidad_id);
    this.turnos = [];
    this.generarTurnosDisponibles();
  }

  CancelarEspecialidad() {
    this.especialidad = undefined;
    this.turnos = [];
  }

  ElegirTurno(_turno: Turno) {
    this.turno = _turno;
  }

  CancelarTurno() {
    this.turno = undefined;
  }

  FiltrarEspecialistas() {
    this.servSpinner.showWithMessage('turno-form-filtrar-especialistas', "Filtrando especialistas datos...");

    this.especialistas = this.servUsuario.especialistas.value.filter(especialista =>
      especialista.habilitado &&
      especialista.especialidades.some(especialidadId =>
        this.servEspecialidad.especialidades.value.some(especialidad =>
          especialidad.id === especialidadId && especialidad.valida
        )
      )
    );

    if (this.ready.especialistas && this.ready.especialidades) {
      this.servSpinner.hideWithMessage('turno-form-filtrar-especialistas');
    }
  }

  private generarTurnosDisponibles() {
    this.servSpinner.showWithMessage('turno-form-generar-turnos', "Generando turnos...");

    if (this.especialista && this.paciente && this.especialidad) {
      this.servTurno.GenerarTurnos(this.paciente.uid, this.especialista.uid, this.especialidad.id, this.especialista.disponibilidades, 15).then(
        (_turnos: Turno[]) => {
          this.turnos = _turnos;
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