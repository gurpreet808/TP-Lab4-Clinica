import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { Especialista, Paciente, Usuario } from '../../modulos/auth/clases/usuario';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { UsuarioItemComponent } from './componentes/usuario-item/usuario-item.component';
import { UsuarioFormComponent } from '../../componentes/usuario-form/usuario-form.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    UsuarioItemComponent,
    UsuarioFormComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  tipo_usuario: string = "";
  testing: any;

  editModal: boolean = false;
  globalFilter: string = "";
  filterByParams: string[] = ["nombre", "email"];
  sortField: string = "nombre";
  sortOrder: number = 1;
  sortOptions: SelectItem[] = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'E-Mail', value: 'email' },
    { label: 'Fecha de creación', value: 'fecha_creacion' }
  ];

  constructor(
    public servUsuario: UsuarioService,
    public servAuth: AuthService,
    public servSpinner: SpinnerService,
    public messageService: MessageService
  ) {
    this.servSpinner.showWithMessage("usuarios-load", "Cargando datos de usuarios...");

    this.servUsuario.Ready().then(
      () => {
        console.log("UsuariosComponent", "Ready");
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("UsuariosComponent", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    ).finally(
      () => {
        this.servSpinner.hideWithMessage("usuarios-load");
      }
    );
  }

  ngOnInit(): void {
  }

  clear(table: Table) {
    this.globalFilter = "";
    table.clear();
  }

  NuevoUsuario(tipo: string) {
    this.tipo_usuario = tipo;
    this.editModal = true;
  }

  Cancelar() {
    //console.log("Cancelar");
    this.editModal = false;
  }

  async ToogleHabilitarEspecialista(especialista: Especialista) {
    especialista.habilitado = !especialista.habilitado;
    this.servUsuario.Modificar(especialista).then(
      () => {
        if (especialista.habilitado)
          this.messageService.add({ severity: 'success', life: 10000, summary: 'Éxito', detail: "Especialista habilitado" });
        else
          this.messageService.add({ severity: 'success', life: 10000, summary: 'Éxito', detail: "Especialista deshabilitado" });
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("CopiarRutaCheckOut", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    );
  }

  actionHandler(actionObject: { action: string, item: Usuario }) {
    //console.log("actionHandler", actionObject);

    switch (actionObject.action) {
      case "habilitar-especialista":
        this.ToogleHabilitarEspecialista(actionObject.item as Especialista);
        break;
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
