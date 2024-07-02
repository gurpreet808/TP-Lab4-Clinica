import { Component, OnInit } from '@angular/core';
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
import { Turno } from '../../clases/turno';
import { JsonPipe } from '@angular/common';

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
    JsonPipe
  ],
  templateUrl: './turno-list.component.html',
  styleUrl: './turno-list.component.scss'
})
export class TurnoListComponent implements OnInit {
  tipo_usuario_actual: string = "";
  testing: any;

  editModal: boolean = false;
  globalFilter: string = "";
  filterByParams: string[] = ["nombre", "apellido", "email"];
  sortField: string = "nombre";
  sortOrder: number = 1;
  sortOptions: SelectItem[] = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'E-Mail', value: 'email' },
    { label: 'Fecha de creación', value: 'fecha_creacion' }
  ];

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
    ).finally(
      () => {
        this.servSpinner.hideWithMessage("turnos-init");
      }
    );
  }

  ngOnInit(): void {
  }

  clear(table: Table) {
    this.globalFilter = "";
    table.clear();
  }

  NuevoTurno() {
    this.editModal = true;
  }

  CancelarEdicion() {
    //console.log("Cancelar");
    this.editModal = false;
  }

  CancelarTurno() {
    /* Sólo pueden Paciente, Especialista y Admin si el estado del turno es Pendiente. También los Paciente si el estado es Aceptado */
  }

  VerReseña() {
    //Sólo Especialista y Paciente si hay reseña
  }

  CompletarEncuesta() {
    //Sólo Paciente si el estado del turno es Realizado y si hay reseña del especialista
  }

  CalificarAtencion() {
    //Sólo Paciente si el estado del turno es Realizado y si hay reseña del especialista
  }

  RechazarTurno() {
    //Sólo Especialista si el estado del turno es Pendiente
  }

  AceptarTurno() {
    //Sólo Especialista si el estado del turno es Pendiente
  }

  FinalizarTurno() {
    //Sólo Especialista si el estado del turno es Aceptado
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
