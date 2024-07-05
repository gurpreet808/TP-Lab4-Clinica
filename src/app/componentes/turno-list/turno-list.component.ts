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
import { FieldsetModule } from 'primeng/fieldset';
import { RatingModule } from 'primeng/rating';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { TurnoService } from '../../servicios/turno.service';
import { EstadoTurno, Turno, TURNO_DEFAULT } from '../../clases/turno';
import { AsyncPipe, JsonPipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TurnoItemComponent } from '../turno-item/turno-item.component';
import { TurnoFormComponent } from '../turno-form/turno-form.component';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';
import { ResaltarEstadoTurnoDirective } from '../../directivas/resaltar-estado-turno.directive';
import { EspecialidadService } from '../../servicios/especialidad.service';

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
    FieldsetModule,
    TurnoItemComponent,
    TurnoFormComponent,
    NombreApellidoUsuarioPipe,
    ResaltarEstadoTurnoDirective,
    AsyncPipe,
    KeyValuePipe,
    TitleCasePipe,
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

  nombre_campo_historia_clinica: string = "";
  valor_campo_historia_clinica: number = 0;

  _turnosFiltrados: Turno[] = [];
  campoSeleccionado: string = "";
  valorBusqueda: string = "";
  camposDeBusqueda: SelectItem[] = [
    { label: 'Paciente', value: 'id_paciente' },
    { label: 'Especialista', value: 'id_especialista' },
    { label: 'Estado', value: 'estado' },
    { label: 'Fecha', value: 'fecha' },
    { label: 'Hora', value: 'hora' },
    { label: 'Especialidad', value: 'especialidad' },
    { label: 'Comentario', value: 'comentario' },
    { label: 'Encuesta', value: 'encuesta' },
    { label: 'Calificación', value: 'calificacion' }
    // Faltan las opciones para campos dinámicos de la historia clínica
  ];

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
    public servEspecialidad: EspecialidadService,
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
            console.log("TraerTurnosPorPaciente", turnos);
            this._turnos = turnos;
            this.actualizarCamposDeBusqueda();
            this.FiltrarTurnos();
          }
        );
        break;
      case "especialista":
        this.turnos_suscription = this.servTurno.TraerTurnosPorEspecialista(this.servAuth.usuarioActual.value!.uid).subscribe(
          (turnos: Turno[]) => {
            console.log("TraerTurnosPorEspecialista", turnos);
            this._turnos = turnos;
            this.actualizarCamposDeBusqueda();
            this.FiltrarTurnos();
          }
        );
        break;
      default:
        this.turnos_suscription = this.servTurno.TraerTodos().subscribe(
          (turnos: Turno[]) => {
            console.log("TraerTodos", turnos);
            this._turnos = turnos;
            this.actualizarCamposDeBusqueda();
            this.FiltrarTurnos();
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

    if ((this._turno_seleccionado.estado == EstadoTurno.Cancelado || this._turno_seleccionado.estado == EstadoTurno.Rechazado || this._turno_seleccionado.estado == EstadoTurno.Finalizado) && !this._turno_seleccionado.comentario.texto) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Debe ingresar un comentario.' });
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

  AgregarCampoDinamicoHistoriaClinica() {
    if (!this.nombre_campo_historia_clinica) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Debe ingresar un nombre para el campo.' });
      return;
    }

    if (this._turno_seleccionado && this._turno_seleccionado.historia_clinica[this.nombre_campo_historia_clinica]) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Ya existe un campo con ese nombre.' });
      return;
    }

    if (this.valor_campo_historia_clinica === null || this.valor_campo_historia_clinica === undefined) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Debe ingresar un valor para el campo.' });
      return;
    }

    if (this._turno_seleccionado) {
      this._turno_seleccionado.historia_clinica[this.nombre_campo_historia_clinica] = this.valor_campo_historia_clinica;
    }

    this.nombre_campo_historia_clinica = "";
    this.valor_campo_historia_clinica = 0;
  }

  BorrarCampoDinamicoHistoriaClinica(key: string) {
    if (this._turno_seleccionado) {
      delete this._turno_seleccionado.historia_clinica[key];
    }
  }

  EsCampoFijo(key: string): boolean {
    return Object.keys(TURNO_DEFAULT.historia_clinica).includes(key);
  }

  FiltrarTurnos() {
    //console.log("FiltrarTurnos", this.campoSeleccionado, this.valorBusqueda);
    //console.log("Opciones de búsqueda", this.camposDeBusqueda);

    if (!this.campoSeleccionado || !this.valorBusqueda) {
      this._turnosFiltrados = this._turnos;
    } else {
      this._turnosFiltrados = this._turnos.filter(
        (turno: Turno) => {
          const valorCampo = this.obtenerValorCampo(turno, this.campoSeleccionado);

          //console.log("Valor campo", valorCampo);

          if (typeof valorCampo === 'string') {
            return valorCampo.toLowerCase().includes(this.valorBusqueda.toLowerCase());
          } else if (valorCampo instanceof Date) {
            return valorCampo.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).includes(this.valorBusqueda);
          } else if (valorCampo !== undefined) { // Agregar condición para undefined
            return valorCampo.toString().toLowerCase().includes(this.valorBusqueda.toLowerCase());
          } else {
            return false; // Si valorCampo es undefined, no se incluye en el filtro
          }
        }
      );
    }
  }

  private obtenerValorCampo(turno: Turno, campo: string): string | number | Date {
    if (typeof campo !== 'string') {
      console.error('El campo debe ser una cadena de texto:', campo);
      return ''; // O un valor por defecto adecuado
    }

    if (campo.startsWith('historia_clinica.')) {
      const campoHistoriaClinica = campo.split('.')[1];
      return turno.historia_clinica[campoHistoriaClinica] || '';
    } else if (campo === 'id_paciente') {
      let usuario_encontrado: { nombre: string; apellido: string; } | undefined = this.servUsuario.ObtenerNombreApellidoUsuarioPorID(turno[campo]);
      return usuario_encontrado ? `${usuario_encontrado.nombre} ${usuario_encontrado.apellido}` : '';
    } else if (campo === 'id_especialista') {
      let usuario_encontrado: { nombre: string; apellido: string; } | undefined = this.servUsuario.ObtenerNombreApellidoUsuarioPorID(turno[campo]);
      return usuario_encontrado ? `${usuario_encontrado.nombre} ${usuario_encontrado.apellido}` : '';
    } else if (campo === 'especialidad') {
      return this.servEspecialidad.obtenerEspecialidadPorId(turno[campo])?.nombre || '';
    } else if (campo === 'estado') {
      return EstadoTurno[turno[campo]];
    } else if (campo === 'fecha') {
      return turno.fecha;
    } else if (campo === 'hora') {
      return turno.hora;
    } else if (campo === 'comentario') {
      return turno.comentario.texto;
    } else if (campo === 'encuesta') {
      return Object.values(turno.encuesta).join(' ');
    } else {
      return (turno as any)[campo];
    }
  }

  private actualizarCamposDeBusqueda() {
    if (this.tipo_usuario_actual === "paciente") {
      this.camposDeBusqueda = this.camposDeBusqueda.filter(campo => campo.value !== 'id_paciente');
    } else if (!this.camposDeBusqueda.some(campo => campo.value === 'id_paciente')) {
      this.camposDeBusqueda.push({ label: 'Paciente', value: 'id_paciente' });
    }

    if (this.tipo_usuario_actual === "especialista") {
      this.camposDeBusqueda = this.camposDeBusqueda.filter(campo => campo.value !== 'id_especialista');
    } else if (!this.camposDeBusqueda.some(campo => campo.value === 'id_especialista')) {
      this.camposDeBusqueda.push({ label: 'Especialista', value: 'id_especialista' });
    }

    // Obtener los campos dinámicos de la historia clínica
    const camposDinamicos = this.obtenerCamposDinamicosHistoriaClinica();

    // Agregar los campos dinámicos al dropdown
    this.camposDeBusqueda = [
      ...this.camposDeBusqueda.filter(campo => !(campo.value as string).startsWith('historia_clinica.')), // Eliminar los campos dinámicos anteriores
      ...camposDinamicos.map(campo => ({ label: `Historia Clínica: ${campo}`, value: `historia_clinica.${campo}` }))
    ];
  }

  private obtenerCamposDinamicosHistoriaClinica(): string[] {
    const campos: Set<string> = new Set();
    this._turnos.forEach(turno => {
      Object.keys(turno.historia_clinica).forEach(key => {
        if (!this.esCampoFijoHistoriaClinica(key)) {
          campos.add(key);
        }
      });
    });
    return Array.from(campos);
  }

  private esCampoFijoHistoriaClinica(key: string): boolean {
    return ['altura', 'peso', 'temperatura', 'presion'].includes(key);
  }

  Test(any?: any) {
    console.log("Test", any);
  }
}
