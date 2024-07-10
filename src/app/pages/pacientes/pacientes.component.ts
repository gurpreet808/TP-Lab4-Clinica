import { Component, OnDestroy, OnInit } from '@angular/core';
import { TurnoService } from '../../servicios/turno.service';
import { Turno } from '../../clases/turno';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { Subscription } from 'rxjs';
import { HistoriaClinicaComponent } from '../../componentes/historia-clinica/historia-clinica.component';
import { DialogModule } from 'primeng/dialog';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { Paciente, Usuario } from '../../modulos/auth/clases/usuario';
import { TurnoItemComponent } from '../../componentes/turno-item/turno-item.component';
import { ResaltarEstadoTurnoDirective } from '../../directivas/resaltar-estado-turno.directive';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    FormsModule,
    HistoriaClinicaComponent,
    TurnoItemComponent,
    DialogModule,
    ButtonModule,
    RatingModule,
    NombreApellidoUsuarioPipe,
    ResaltarEstadoTurnoDirective,
    JsonPipe,
    AsyncPipe
  ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit, OnDestroy {

  pacientes: Paciente[] = [];
  turnos_suscription: Subscription;

  turnos_paciente: Turno[] = [];
  turnos_paciente_suscription: Subscription | undefined;

  paciente_seleccionado: Paciente | undefined;
  turno_seleccionado: Turno | undefined;
  pregunta_1: string = "¿Se le hizo fácil solicitar el turno?";
  pregunta_2: string = "¿Esperó mucho tiempo antes de ser atendido?";
  pregunta_3: string = "¿Nuestras instalaciones estaban limpias?";

  showModal: boolean = false;
  modalAction: string = "";
  modalTitle: string = "";

  constructor(public servTurnos: TurnoService, public servAuth: AuthService, public servUsuario: UsuarioService) {
    this.turnos_suscription = this.servTurnos.TraerTurnosPorEspecialistaPorEstado(this.servAuth.usuarioActual.value!.uid, 5).subscribe(
      (turnos: Turno[]) => {
        turnos.forEach(
          (turno: Turno) => {
            this.servUsuario.BuscarUsuarioPorUID(turno.id_paciente).then(
              (paciente: Usuario) => {
                if (!this.pacientes.some(p => p.uid === paciente.uid)) {
                  this.pacientes.push(paciente as Paciente);
                }
              }
            ).catch(
              (error: any) => {
                console.error("BuscarUsuarioPorUID", error);
              }
            );
          }
        );
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.turnos_suscription.unsubscribe();

    if (this.turnos_paciente_suscription) {
      this.turnos_paciente_suscription.unsubscribe();
    }
  }

  SeleccionarPaciente(paciente: Paciente) {
    this.paciente_seleccionado = paciente;

    this.turnos_paciente_suscription = this.servTurnos.TraerTurnosPorPacientePorEstado(paciente.uid, 5).subscribe(
      (turnos: Turno[]) => {
        this.turnos_paciente = turnos.filter(turno => turno.id_especialista == this.servAuth.usuarioActual.value!.uid);
      }
    );
  }

  CancelarSeleccionPaciente() {
    this.paciente_seleccionado = undefined;
    this.turnos_paciente_suscription = undefined;
  }

  OcultarModal() {
    this.showModal = false;
    this.modalAction = "";
    this.modalTitle = "";
  }

  MostrarHistoriaClinica() {
    this.showModal = true;
    this.modalAction = "historia_clinica";
  }

  VerResenia(_turno: Turno) {
    this.turno_seleccionado = _turno;
    this.showModal = true;
    this.modalAction = "reseña";
    this.modalTitle = "Reseña del turno";
  }
}
