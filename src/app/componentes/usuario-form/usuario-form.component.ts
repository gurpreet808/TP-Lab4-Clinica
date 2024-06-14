import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem, MessageService } from 'primeng/api';
import { DisponibilidadEspecialidad, Disponibilidad } from '../../clases/disponibilidad';
import { Especialidad } from '../../clases/especialidad';
import { ObraSocial } from '../../clases/obra-social';
import { Usuario, Especialista, Paciente } from '../../modulos/auth/clases/usuario';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { EspecialidadService } from '../../servicios/especialidad.service';
import { FileHandlerService } from '../../servicios/file-handler.service';
import { ObraSocialService } from '../../servicios/obra-social.service';
import { DisponibilidadService } from '../../servicios/disponibilidad.service';
import { ExisteStringValidator } from '../../validators/existeStringValidator';
import { map } from 'rxjs';
import { confirmarCalveValidator } from '../../validators/confirmarClaveValidator';
import { requeridoSegunTipoUsuario } from '../../validators/requeridoSegunTipoUsuarioValidator';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { ShowValidationErrorsDirective } from '../../directivas/show-validation-errors.directive';
import { ValidatorMessage } from '../../clases/validator-message';
import { DiaPipe } from '../../pipes/dia.pipe';
import { EspecialidadPipe } from '../../pipes/especialidad.pipe';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    PasswordModule,
    MultiSelectModule,
    ShowValidationErrorsDirective,
    DiaPipe,
    EspecialidadPipe
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit, OnChanges {
  @Output() closeModal = new EventEmitter();
  @Input() tipo_usuario: string = '';
  especialidades: Especialidad[] = [];
  obras_sociales: ObraSocial[] = [];
  agregar_especialidad: string = '';
  userForm: FormGroup;
  file_1: File | undefined;
  file_2: File | undefined;

  new_disponibilidad: DisponibilidadEspecialidad = {
    dia: -1,
    hora_fin: 0,
    hora_inicio: 0,
    especialidad: '',
  }

  min_hora_inicio: number = 0;
  max_hora_fin: number = 23;

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
    existeString: 'Ya existe ese valor.'
  };

  constructor(
    private formBuilder: FormBuilder,
    public servObraSocial: ObraSocialService,
    public servEspecialidad: EspecialidadService,
    public servUsuario: UsuarioService,
    public servAuth: AuthService,
    public servFile: FileHandlerService,
    public servDisponibilidad: DisponibilidadService,
    public servSpinner: SpinnerService,
    public messageService: MessageService,
    public router: Router,
  ) {
    this.servSpinner.showWithMessage('alta-usuario-init', 'Cargando datos...');

    this.servObraSocial.obras_sociales.subscribe(
      (obras_sociales) => {
        this.obras_sociales = obras_sociales;
      }
    );

    this.servEspecialidad.especialidades.subscribe(
      (especialidades) => {
        this.especialidades = especialidades;
      }
    );

    this.userForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email], [ExisteStringValidator(this.servUsuario.usuarios.pipe(map(usuarios => usuarios.map(usuario => usuario.email))))]],
        clave: ['', [Validators.required, Validators.minLength(6)]],
        clave2: ['', [Validators.required, Validators.minLength(6)]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Záéíóúñ .,]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Záéíóúñ .,]+$')]],
        dni: ['', [Validators.required, Validators.minLength(10000000), Validators.maxLength(99999999), Validators.pattern('^[0-9]{8}$')], [ExisteStringValidator(this.servUsuario.usuarios.pipe(map(usuarios => usuarios.map(usuario => usuario.dni.toString()))))]],
        edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
        url_foto_1: ['', [Validators.required]],
        url_foto_2: ['',],
        obra_social: ['',],
        especialidades: ['',],
        disponibilidades: ['',],
      }
    );

    this.userForm.setValidators(confirmarCalveValidator('clave', 'clave2'));
  }

  ngOnInit(): void {
    console.log(this.tipo_usuario);
    this.userForm.markAllAsTouched();
    this.servSpinner.hideWithMessage('alta-usuario-init');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipo_usuario'] && !changes['tipo_usuario'].firstChange) {
      this.userForm.get('obra_social')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['paciente'])]);
      this.userForm.get('url_foto_2')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['paciente'])]);
      this.userForm.get('especialidades')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['especialista'])]);
      this.userForm.get('disponibilidades')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['especialista'])]);
      this.userForm.updateValueAndValidity();
    }
  }

  getControl(control_name: string) {
    return this.userForm.get(control_name);
  }

  getControlValue(control_name: string) {
    return this.getControl(control_name)?.value;
  }

  isValidControl(control_name: string) {
    let control = this.getControl(control_name);

    if (control != null) {
      return control.invalid;
    }

    return false;
  }

  logForm() {
    console.log(this.userForm);
  }

  async RegistrarUsuario() {
    console.log(this.userForm);
    this.servSpinner.showWithMessage('registrar-usuario', 'Registrando usuario...');

    if (this.userForm.valid) {
      let usuario: Usuario | Especialista | Paciente = {
        uid: 'new',
        email: this.getControlValue('email'),
        clave: this.getControlValue('clave'),
        tipo: this.tipo_usuario,
        nombre: this.getControlValue('nombre'),
        apellido: this.getControlValue('apellido'),
        dni: this.getControlValue('dni'),
        edad: this.getControlValue('edad'),
        url_foto_1: this.getControlValue('url_foto_1'),
        fecha_alta: new Date(),
        fecha_modificacion: new Date(),
      }

      switch (usuario.tipo) {
        case "especialista":
          (usuario as Especialista).habilitado = false;
          if (this.servAuth.usuarioActual.value && this.servAuth.usuarioActual.value.tipo == 'admin') {
            (usuario as Especialista).habilitado = true;
          }
          let especialidades: Especialidad[] = this.getControlValue('especialidades');
          (usuario as Especialista).especialidades = this.getControlValue('especialidades').map((esp: Especialidad) => esp.id);
          (usuario as Especialista).disponibilidades = this.getControlValue('disponibilidades');
          break;

        case "paciente":
          (usuario as Paciente).obra_social = this.getControlValue('obra_social').id;
          break;

        default:
          break;
      }

      await this.servAuth.RegistrarUsuarioConEmail(usuario).then(
        async (_usuario: Usuario) => {
          //console.log("usuario creado", _usuario);
          //console.log("usuario anterior", usuario);

          const images_path = `images/usuarios/${_usuario.uid}/`;

          if (this.file_1 != undefined) {
            this.servSpinner.showWithMessage('registrar-usuario', 'Subiendo imagen 1...');
            let path_1 = `${images_path}${this.file_1.name}`;

            _usuario.url_foto_1 = await this.servFile.uploadFileAndGetURL(this.file_1, path_1).then(
              async (url: string) => {
                console.log("in await 1", url);
                this.servSpinner.showWithMessage('registrar-usuario', 'Guardando datos de usuario...');
                return url;
              }
            ).catch(
              (error) => {
                console.log("subir img 1", error);
                throw error;
              }
            );
          }

          if (this.file_2 != undefined) {
            this.servSpinner.showWithMessage('registrar-usuario', 'Subiendo imagen 2...');
            let path_2 = `${images_path}${this.file_2.name}`;

            (_usuario as Paciente).url_foto_2 = await this.servFile.uploadFileAndGetURL(this.file_2, path_2).then(
              async (url: string) => {
                console.log("in await 2", url);
                this.servSpinner.showWithMessage('registrar-usuario', 'Guardando datos de usuario...');
                return url;
              }
            ).catch(
              (error) => {
                console.log("subir img 2", error);
                throw error;
              }
            );
          }

          console.log("pre mod", _usuario);

          this.servUsuario.Modificar(_usuario).then(
            () => {
              console.log('Usuario modificado');
              this.servSpinner.hideWithMessage('registrar-usuario');
              this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se registró su usuario. Recuerde verificar su mail para usar la aplicación.' });

              if (this.servAuth.usuarioActual.value && this.servAuth.usuarioActual.value.tipo != 'admin') {
                this.router.navigate(['/']);
              } else {
                this.closeModal.emit();
              }
            }
          ).catch(
            (error) => {
              console.log("mod after upload", error);
            }
          );
        }
      ).catch(
        (error) => {
          console.log("Agregar usuario", error);
        }
      );
    }
  }

  async AgregarEspecialidad() {
    if (this.agregar_especialidad != '') {
      let especialidad: Especialidad = {
        id: 'new',
        nombre: this.agregar_especialidad,
        valida: false
      }

      /* if (this.servAuth.usuarioActual && this.servAuth.usuarioActual.tipo == 'admin') {
        especialidad.valida = true;
      } */

      this.servSpinner.showWithMessage('agregar-especialidad', 'Agregando especialidad...');

      await this.servEspecialidad.Nuevo(especialidad).then(
        () => {
          this.agregar_especialidad = '';
          this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se agregó la especialidad' });
        }
      ).catch(
        (error) => {
          console.log(error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        }
      );

      this.servSpinner.hideWithMessage('agregar-especialidad');
    }
  }

  fileChange(event: any, file_number: number) {
    let files = event.target.files;

    if (files.length > 0) {
      switch (file_number) {
        case 1:
          if (files[0].type.split('/')[0] != 'image') {
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'El archivo debe ser una imagen' });
            this.userForm.get('url_foto_1')?.setValue('');
            return;
          }

          if (files[0].size > 2097152) {
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'El archivo no debe pesar más de 2MB' });
            this.userForm.get('url_foto_1')?.setValue('');
            return;
          }

          this.file_1 = files[0];
          break;

        case 2:
          if (files[0].type.split('/')[0] != 'image') {
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'El archivo debe ser una imagen' });
            this.userForm.get('url_foto_2')?.setValue('');
            return;
          }

          if (files[0].size > 2097152) {
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'El archivo no debe pesar más de 2MB' });
            this.userForm.get('url_foto_2')?.setValue('');
            return;
          }

          this.file_2 = files[0];
          break;

        default:
          break;
      }
    }

    console.log(this.file_1);
    console.log(this.file_2);
  }

  AgregarDisponibilidad() {
    console.log(this.new_disponibilidad);

    if (this.new_disponibilidad.hora_fin <= this.new_disponibilidad.hora_inicio) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'La hora de fin debe ser mayor a la de inicio' });
      return;
    }

    if (this.new_disponibilidad.dia == -1) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Debe elegir un día' });
      return;
    }

    if (this.new_disponibilidad.especialidad == '') {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Debe elegir una especialidad' });
      return;
    }

    if (this.new_disponibilidad.hora_inicio < this.min_hora_inicio) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: `La clínica está disponible desde las ${this.min_hora_inicio}:00 en ese día` });
      return;
    }

    if (this.new_disponibilidad.hora_fin > this.max_hora_fin) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: `La clínica está disponible hasta las ${this.max_hora_fin}:00 en ese día` });
      return;
    }

    let disponibilidades: DisponibilidadEspecialidad[] = this.getControlValue('disponibilidades');
    let overlap = false;
    for (let d = 0; d < disponibilidades.length; d++) {
      if (disponibilidades[d].dia == this.new_disponibilidad.dia) {
        if (disponibilidades[d].hora_inicio < this.new_disponibilidad.hora_inicio && this.new_disponibilidad.hora_inicio < disponibilidades[d].hora_fin) {
          overlap = true;
          break;
        }
        if (disponibilidades[d].hora_inicio < this.new_disponibilidad.hora_fin && this.new_disponibilidad.hora_fin < disponibilidades[d].hora_fin) {
          overlap = true;
          break;
        }
        if (this.new_disponibilidad.hora_inicio < disponibilidades[d].hora_inicio && disponibilidades[d].hora_inicio < this.new_disponibilidad.hora_fin) {
          overlap = true;
          break;
        }
        if (this.new_disponibilidad.hora_inicio < disponibilidades[d].hora_fin && disponibilidades[d].hora_fin < this.new_disponibilidad.hora_fin) {
          overlap = true;
          break;
        }
      }
    }

    if (overlap) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Los horarios elegidos se superponen en ese día' });
      return;
    }

    this.getControl('disponibilidades')?.setValue([...this.getControlValue('disponibilidades'), this.new_disponibilidad]);

    this.new_disponibilidad = {
      dia: -1,
      hora_fin: 0,
      hora_inicio: 0,
      especialidad: '',
    }
  }

  BorrarDisponibilidad(disponibilidad: DisponibilidadEspecialidad) {
    let disponibilidades: DisponibilidadEspecialidad[] = this.getControlValue('disponibilidades');
    let index = disponibilidades.indexOf(disponibilidad);
    disponibilidades.splice(index, 1);
    this.getControl('disponibilidades')?.setValue(disponibilidades);
  }

  async SetMaxMinHoraFinDisponibilidadDia() {
    if (this.new_disponibilidad.dia) {
      await this.servDisponibilidad.DisponibilidadTotalClinicaPorDia(this.new_disponibilidad.dia).then(
        (disponibilidad: Disponibilidad) => {
          console.log(disponibilidad);
          this.min_hora_inicio = disponibilidad.hora_inicio;
          this.max_hora_fin = disponibilidad.hora_fin;
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.min_hora_inicio = 0;
      this.max_hora_fin = 23;
    }

    this.new_disponibilidad.hora_inicio = this.min_hora_inicio;
    this.new_disponibilidad.hora_fin = this.max_hora_fin;
  }
}
