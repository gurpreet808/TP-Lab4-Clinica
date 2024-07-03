import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { TurnoService } from '../../servicios/turno.service';
import { EstadoTurno, Turno } from '../../clases/turno';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TurnoItemComponent } from '../turno-item/turno-item.component';
import { TurnoFormComponent } from '../turno-form/turno-form.component';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';
import { ResaltarEstadoTurnoDirective } from '../../directivas/resaltar-estado-turno.directive';

@Component({
  selector: 'app-turno-list',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    RatingModule,
    TurnoItemComponent,
    TurnoFormComponent,
    NombreApellidoUsuarioPipe,
    ResaltarEstadoTurnoDirective,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './turno-list.component.html',
  styleUrl: './turno-list.component.scss'
})
export class TurnoListComponent implements OnInit, OnDestroy {
  _turnos: Turno[] = [];
  _turno_seleccionado: Turno | undefined;
  tipo_usuario_actual: string = "";
  testing: any;

  showModal: boolean = false;
  actionModal: string = "";
  titleModal: string = "";

  pregunta_1: string = "¿Se le hizo fácil solicitar el turno?";
  pregunta_2: string = "¿Esperó mucho tiempo antes de ser atendido?";
  pregunta_3: string = "¿Nuestras instalaciones estaban limpias?";

  globalFilter: string = "";
  filterByParams: string[] = ["nombre", "apellido", "email"];
  sortField: string = "nombre";
  sortOrder: number = 1;
  sortOptions: SelectItem[] = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'E-Mail', value: 'email' },
    { label: 'Fecha de creación', value: 'fecha_creacion' }
  ];

  turnos_suscription: Subscription | undefined;

  constructor(
    public servTurno: TurnoService,
    public servUsuario: UsuarioService,
    public servAuth: AuthService,
    public servSpinner: SpinnerService,
    public messageService: MessageService
  ) {
    this.servSpinner.showWithMessage("turnos-init", "Cargando datos de los turnos...");

    this.servTurno.Ready().then(
      () => {
        console.log("TurnosComponent", "Ready");

        this.servAuth.IsLoggedIn().then(
          (loggedIn: boolean) => {
            this.tipo_usuario_actual = this.servAuth.usuarioActual.value?.tipo || "";
          }
        );
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("TurnosComponent", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    );
  }

  ngOnInit(): void {
    //console.log(this.servAuth.usuarioActual.value?.tipo);
    this.tipo_usuario_actual = this.servAuth.usuarioActual.value!.tipo;

    switch (this.tipo_usuario_actual) {
      case "paciente":
        this.turnos_suscription = this.servTurno.TraerTurnosPorPaciente(this.servAuth.usuarioActual.value!.uid).subscribe(
          (turnos: Turno[]) => {
            this._turnos = turnos;
          }
        );
        break;
      case "especialista":
        this.turnos_suscription = this.servTurno.TraerTurnosPorEspecialista(this.servAuth.usuarioActual.value!.uid).subscribe(
          (turnos: Turno[]) => {
            this._turnos = turnos;
          }
        );
        break;
      default:
        this.turnos_suscription = this.servTurno.TraerTodos().subscribe(
          (turnos: Turno[]) => {
            this._turnos = turnos;
          }
        );
        break;
    }

    this.servSpinner.hideWithMessage("turnos-init");
  }

  ngOnDestroy(): void {
    if (this.turnos_suscription) {
      this.turnos_suscription.unsubscribe();
    }
  }

  clear(table: Table) {
    this.globalFilter = "";
    table.clear();
  }

  NuevoTurno() {
    this.actionModal = "nuevo";
    this.titleModal = "Nuevo Turno";
    this.showModal = true;
  }

  CancelarModal() {
    this.actionModal = "";
    this.titleModal = "";
    this.showModal = false;
    this._turno_seleccionado = undefined;
  }

  CancelarTurno(_turno: Turno) {
    /* Sólo pueden Paciente, Especialista y Admin si el estado del turno es Pendiente. También los Paciente si el estado es Aceptado */
    //Debería abrir un popup o dialog para que cargue el comentario de cancelacion
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);
    this._turno_seleccionado.comentario.autor = this.servAuth.usuarioActual.value!.uid;
    this._turno_seleccionado.estado = EstadoTurno.Cancelado;

    this.actionModal = "comentario";
    this.titleModal = "Cancelar Turno";
    this.showModal = true;
  }

  VerResenia(_turno: Turno) {
    //Sólo Especialista y Paciente si hay reseña
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);

    this.actionModal = "verdatos";
    this.titleModal = "Reseña del turno";
    this.showModal = true;
  }

  CompletarEncuesta(_turno: Turno) {
    //Sólo Paciente si el estado del turno es Realizado y si hay reseña del especialista
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);

    this.actionModal = "encuesta";
    this.titleModal = "Encuesta de atención";
    this.showModal = true;
  }

  CalificarAtencion(_turno: Turno) {
    //Sólo Paciente si el estado del turno es Realizado y si hay reseña del especialista
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);

    this.actionModal = "calificacion";
    this.titleModal = "Calificación de atención";
    this.showModal = true;
  }

  RechazarTurno(_turno: Turno) {
    //Sólo Especialista si el estado del turno es Pendiente
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);
    this._turno_seleccionado.comentario.autor = this.servAuth.usuarioActual.value!.uid;
    this._turno_seleccionado.estado = EstadoTurno.Rechazado;

    this.actionModal = "comentario";
    this.titleModal = "Rechazar Turno";
    this.showModal = true;
  }

  AceptarTurno(_turno: Turno) {
    //Sólo Especialista si el estado del turno es Pendiente
    //Sólo cambiar de estado
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);
    this._turno_seleccionado.estado = EstadoTurno.Aceptado;
    this.GuardarCambios();
  }

  FinalizarTurno(_turno: Turno) {
    //Sólo Especialista si el estado del turno es Aceptado
    this._turno_seleccionado = this.servTurno.ClonarTurno(_turno);
    this._turno_seleccionado.comentario.autor = this.servAuth.usuarioActual.value!.uid;
    this._turno_seleccionado.estado = EstadoTurno.Finalizado;

    this.actionModal = "comentario";
    this.titleModal = "Finalizar Turno";
    this.showModal = true;
  }

  GuardarCambios() {
    if (!this._turno_seleccionado) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'No se ha seleccionado un turno para modificar.' });
      return;
    }

    this.servSpinner.showWithMessage("turnos-save", "Guardando cambios...");
    console.log("GuardarCambios", this._turno_seleccionado);

    this.servTurno.Modificar(this._turno_seleccionado).then(
      (resultado: any) => {
        this.messageService.add({
          severity: 'success', life: 10000, summary: 'Éxito', detail: 'Los cambios se guardaron correctamente.'
        });
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("GuardarCambios", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    ).finally(
      () => {
        this.servSpinner.hideWithMessage("turnos-save");
        this.CancelarModal();
      }
    );
  }

  Test(any?: any) {
    console.log("Test", any);
  }
}
