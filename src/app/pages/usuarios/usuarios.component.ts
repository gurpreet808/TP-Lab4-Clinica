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
import { UsuarioFormComponent } from '../../componentes/usuario-form/usuario-form.component';
import { UsuarioItemComponent } from '../../componentes/usuario-item/usuario-item.component';
import { DropdownModule } from 'primeng/dropdown';
import { HistoriaClinicaComponent } from '../../componentes/historia-clinica/historia-clinica.component';
import { WorkSheet, read, utils, writeFile } from 'xlsx';
import { EspecialidadService } from '../../servicios/especialidad.service';
import { ObraSocialService } from '../../servicios/obra-social.service';

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
    DropdownModule,
    UsuarioItemComponent,
    UsuarioFormComponent,
    HistoriaClinicaComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  tipo_usuario: string = "";
  testing: any;

  editModal: boolean = false;
  showHistoriaClinica: boolean = false;
  usuario_seleccionado: Usuario | undefined;

  globalFilter: string = "";
  filterByParams: string[] = ["nombre", "apellido", "email"];
  sortField: string = "nombre";
  sortOrder: number = 1;
  sortOptions: SelectItem[] = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'E-Mail', value: 'email' },
    { label: 'Fecha de creación', value: 'fecha_creacion' }
  ];

  tipoUsuarioOptions: SelectItem[] = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Especialista', value: 'especialista' },
    { label: 'Paciente', value: 'paciente' }
  ];

  constructor(
    public servUsuario: UsuarioService,
    public servAuth: AuthService,
    public servEspecialidad: EspecialidadService,
    public servObraSocial: ObraSocialService,
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

  OcultarHistoriaClinica() {
    this.showHistoriaClinica = false;
    this.usuario_seleccionado = undefined;
  }

  MostrarHistoriaClinica(usuario: Usuario) {
    this.usuario_seleccionado = usuario;
    this.showHistoriaClinica = true;
  }

  ExportarExcelUsuarios() {
    const nombreHoja = 'Usuarios';
    const nombreArchivo = 'usuarios';
    const datos = this.servUsuario.usuarios.value.map((usuario: Usuario) => this.convertirUsuarioParaExcel(usuario));

    this.ExportArrayToExcel([{ items: datos, nombreHoja }], nombreArchivo);
  }

  private convertirUsuarioParaExcel(usuario: Usuario): any {
    const usuarioParaExportar: any = {
      'Tipo': usuario.tipo,
      'Nombre': usuario.nombre,
      'Apellido': usuario.apellido,
      'DNI': usuario.dni,
      'Edad': usuario.edad,
      'Email': usuario.email,
      'Fecha de Alta': usuario.fecha_alta.toLocaleDateString('es-ES'),
      'Foto 1': usuario.url_foto_1
    };

    if (usuario.tipo === 'especialista') {
      const especialista = usuario as Especialista;
      usuarioParaExportar['Habilitado como especialista'] = especialista.habilitado ? 'Si' : 'No';
      usuarioParaExportar['Especialidades'] = this.obtenerNombresEspecialidades(especialista.especialidades);
    } else if (usuario.tipo === 'paciente') {
      const paciente = usuario as Paciente;
      usuarioParaExportar['Foto 2'] = paciente.url_foto_2;
      usuarioParaExportar['Obra Social'] = this.servObraSocial.obtenerObraSocialPorId(paciente.obra_social)?.nombre || '';
    }

    return usuarioParaExportar;
  }

  private obtenerNombresEspecialidades(especialidadIds: string[]): string {
    return especialidadIds
      .map(id => this.servEspecialidad.obtenerEspecialidadPorId(id)?.nombre || '')
      .filter(nombre => nombre !== '')
      .join(', ');
  }

  ExportArrayToExcel(datos: { items: any[], nombreHoja: string }[], nombreArchivo: string) {
    const workbook = utils.book_new();

    for (let i = 0; i < datos.length; i++) {
      const worksheet = utils.json_to_sheet(datos[i].items);
      utils.book_append_sheet(workbook, worksheet, datos[i].nombreHoja);
    }

    writeFile(workbook, nombreArchivo + '.xlsx');
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
