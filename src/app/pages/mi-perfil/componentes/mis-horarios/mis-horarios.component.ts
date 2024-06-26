import { Component, Input, OnInit } from '@angular/core';
import { Especialista } from '../../../../modulos/auth/clases/usuario';
import { DisponibilidadEspecialidad } from '../../../../clases/disponibilidad';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Especialidad } from '../../../../clases/especialidad';
import { MessageService, SelectItem } from 'primeng/api';
import { UsuarioService } from '../../../../modulos/auth/servicios/usuario.service';
import { DisponibilidadService } from '../../../../servicios/disponibilidad.service';
import { SpinnerService } from '../../../../modulos/spinner/servicios/spinner.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { EspecialidadPipe } from '../../../../pipes/especialidad.pipe';
import { DiaPipe } from '../../../../pipes/dia.pipe';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { EspecialidadService } from '../../../../servicios/especialidad.service';
import { Subscription } from 'rxjs';
import { ValidatorMessage } from '../../../../clases/validator-message';
import { ShowValidationErrorsDirective } from '../../../../directivas/show-validation-errors.directive';

@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    EspecialidadPipe,
    DiaPipe,
    AsyncPipe,
    ShowValidationErrorsDirective,
    JsonPipe
  ],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.scss'
})
export class MisHorariosComponent implements OnInit {
  @Input() especialista!: Especialista;
  especialidades: Especialidad[] = [];
  horarioForm: FormGroup;
  especialidades_suscription: Subscription;

  disponibilidadSeleccionada: DisponibilidadEspecialidad | undefined;

  minHoraInicio: number = 0;
  maxHoraFin: number = 23;

  dias: SelectItem[] = [
    { label: 'Lunes', value: 1 },
    { label: 'Martes', value: 2 },
    { label: 'Miércoles', value: 3 },
    { label: 'Jueves', value: 4 },
    { label: 'Viernes', value: 5 },
    { label: 'Sábado', value: 6 },
    { label: 'Domingo', value: 0 }
  ];

  mensajes_validacion: ValidatorMessage = {
    required: 'Debe completar este campo.',
    min: 'Este campo debe ser como mínimo {requiredLength}.',
    max: 'Este campo debe ser como máximo {requiredLength}.',
    pattern: 'El formato de este campo no es válido.',
    //Agregar mensajes de validación de los validadores personalizados
  };

  constructor(
    private formBuilder: FormBuilder,
    private servUsuario: UsuarioService,
    private servEspecialidad: EspecialidadService,
    private servDisponibilidad: DisponibilidadService,
    private servSpinner: SpinnerService,
    private messageService: MessageService
  ) {
    this.servSpinner.showWithMessage('mis-horarios-init', 'Cargando datos...');

    this.horarioForm = this.formBuilder.group(
      {
        especialidad: ['', [Validators.required]],
        dia: ['', [Validators.required]],
        hora_inicio: [undefined, [Validators.required, Validators.minLength(0), Validators.max(23)]],
        hora_fin: [undefined, [Validators.required, Validators.minLength(0), Validators.max(23)]]
      }
    );

    this.especialidades_suscription = this.servEspecialidad.especialidades.subscribe(
      (especialidades) => {
        this.especialidades = especialidades;
      }
    );

  }

  ngOnInit(): void {
    this.servEspecialidad.Ready().then(
      () => { }
    ).catch(
      (error) => {
        this.mostrarError(error);
      }
    ).finally(
      () => {
        this.servSpinner.hideWithMessage('mis-horarios-init');
      }
    );
  }

  ngOnDestroy(): void {
    this.especialidades_suscription.unsubscribe();
  }

  EditarDisponibilidad(_disponibilidad: DisponibilidadEspecialidad) {
    this.disponibilidadSeleccionada = _disponibilidad;

    this.horarioForm.patchValue({
      dia: _disponibilidad.dia,
      hora_inicio: _disponibilidad.hora_inicio,
      hora_fin: _disponibilidad.hora_fin,
      especialidad: _disponibilidad.especialidad
    });
  }

  async GuardarDisponibilidad() {
    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Debe completar todos los campos.' });
      return;
    }

    this.servSpinner.showWithMessage('mis-horarios-save', 'Guardando disponibilidad...');

    let disponibilidad: DisponibilidadEspecialidad = {
      dia: this.getControlValue('dia'),
      hora_inicio: this.getControlValue('hora_inicio'),
      hora_fin: this.getControlValue('hora_fin'),
      especialidad: this.getControlValue('especialidad')
    };

    if (this.disponibilidadSeleccionada) {
      let index = this.especialista.disponibilidades.indexOf(this.disponibilidadSeleccionada);
      this.especialista.disponibilidades[index] = JSON.parse(JSON.stringify(disponibilidad));
    } else {
      this.especialista.disponibilidades.push(disponibilidad);
    }

    this.servUsuario.Modificar(this.especialista).then(
      () => {
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Éxito', detail: 'Disponibilidad guardada correctamente.' });
      }
    ).catch(
      (error) => {
        this.mostrarError(error);
      }
    ).finally(
      () => {
        this.servSpinner.hideWithMessage('mis-horarios-save');
        this.CancelarEdicion();
      }
    );
  }

  CancelarEdicion() {
    this.disponibilidadSeleccionada = undefined;
    this.horarioForm.reset(); // Resetear el formulario
  }

  async BorrarDisponibilidad(_disponibilidad: DisponibilidadEspecialidad) {
    this.servSpinner.showWithMessage('mis-horarios-delete', 'Eliminando disponibilidad...');

    let index = this.especialista.disponibilidades.indexOf(_disponibilidad);
    this.especialista.disponibilidades.splice(index, 1);

    this.servUsuario.Modificar(this.especialista).then(
      () => {
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Éxito', detail: 'Disponibilidad eliminada correctamente.' });
      }
    ).catch(
      (error) => {
        this.mostrarError(error);
      }
    ).finally(
      () => {
        this.servSpinner.hideWithMessage('mis-horarios-delete');
      }
    );
  }

  getControl(control_name: string) {
    return this.horarioForm.get(control_name);
  }

  getControlValue(control_name: string) {
    return this.getControl(control_name)?.value;
  }

  isValidControl(control_name: string) {
    let control = this.getControl(control_name);

    if (control != null) {
      return (control.invalid && control.touched);
      //return control.invalid;
    }

    return false;
  }

  mostrarError(error: any) {
    if (typeof error === 'string') {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
    } else if (error instanceof Error) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
    } else {
      console.error("MostrarError", error);
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
    }
  }
}