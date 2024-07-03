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
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { TurnoService } from '../../servicios/turno.service';
import { EstadoTurno, Turno } from '../../clases/turno';
import { JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TurnoItemComponent } from '../turno-item/turno-item.component';
import { TurnoFormComponent } from '../turno-form/turno-form.component';

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
    TurnoItemComponent,
    TurnoFormComponent,
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
  }

  CancelarTurno(_turno: Turno) {
    /* Sólo pueden Paciente, Especialista y Admin si el estado del turno es Pendiente. También los Paciente si el estado es Aceptado */
    //Debería abrir un popup o dialog para que cargue el comentario de cancelacion
    this.actionModal = "comentario";
    this.titleModal = "Cancelar Turno";
    this.showModal = true;
  }

  VerResenia(_turno: Turno) {
    //Sólo Especialista y Paciente si hay reseña
    this.actionModal = "verdatos";
    this.titleModal = "Reseña del turno";
    this.showModal = true;
  }

  CompletarEncuesta(_turno: Turno) {
    //Sólo Paciente si el estado del turno es Realizado y si hay reseña del especialista
    this.actionModal = "encuesta";
    this.titleModal = "Encuesta de atención";
    this.showModal = true;
  }

  CalificarAtencion(_turno: Turno) {
    //Sólo Paciente si el estado del turno es Realizado y si hay reseña del especialista
    this.actionModal = "calificacion";
    this.titleModal = "Calificación de atención";
    this.showModal = true;
  }

  RechazarTurno(_turno: Turno) {
    //Sólo Especialista si el estado del turno es Pendiente
    this.actionModal = "comentario";
    this.titleModal = "Rechazar Turno";
    this.showModal = true;
  }

  AceptarTurno(_turno: Turno) {
    //Sólo Especialista si el estado del turno es Pendiente
    //Sólo cambiar de estado
  }

  FinalizarTurno(_turno: Turno) {
    //Sólo Especialista si el estado del turno es Aceptado
    this.actionModal = "comentario";
    this.titleModal = "Finalizar Turno";
    this.showModal = true;
  }

  actionHandler(actionObject: { action: string, item: Turno }) {
    //console.log("actionHandler", actionObject);

    switch (actionObject.action) {
      case "test":
        this.Test();
        break;
      default:
        this.messageService.add({ severity: 'warn', life: 10000, summary: 'Advertencia', detail: "No se encontró la función" });
        console.log("actionHandler", "No se reconoce la acción", actionObject.action);
        break;
    }
  }

  Test(any?: any) {
    console.log("Test", any);
  }
}
