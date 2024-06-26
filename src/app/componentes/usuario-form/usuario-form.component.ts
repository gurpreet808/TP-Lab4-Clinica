import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem, MessageService } from 'primeng/api';
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
import { Subscription, map } from 'rxjs';
import { confirmarCalveValidator } from '../../validators/confirmarClaveValidator';
import { requeridoSegunTipoUsuario } from '../../validators/requeridoSegunTipoUsuarioValidator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputGroupModule } from 'primeng/inputgroup';
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
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    PasswordModule,
    MultiSelectModule,
    InputGroupModule,
    ShowValidationErrorsDirective,
    DiaPipe,
    EspecialidadPipe
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit, OnDestroy, OnChanges {
  @Output() UserCreated = new EventEmitter();
  @Input() tipo_usuario: string = '';
  especialidades: Especialidad[] = [];
  obras_sociales: ObraSocial[] = [];
  agregar_especialidad: string = '';
  userForm: FormGroup;
  file_1: File | undefined;
  file_2: File | undefined;

  obras_sociales_suscription: Subscription;
  especialidades_suscription: Subscription;

  mensajes_validacion: ValidatorMessage = {
    required: 'Debe completar este campo.',
    min: 'Este campo debe ser como mínimo {requiredLength}.',
    max: 'Este campo debe ser como máximo {requiredLength}.',
    pattern: 'El formato de este campo no es válido.',
    existeString: 'Ya existe ese valor.',
    noCoincide: 'Las claves no coinciden.',
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

    this.obras_sociales_suscription = this.servObraSocial.obras_sociales.subscribe(
      (obras_sociales) => {
        this.obras_sociales = obras_sociales;
      }
    );

    this.especialidades_suscription = this.servEspecialidad.especialidades.subscribe(
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
      }
    );

    this.userForm.setValidators(confirmarCalveValidator('clave', 'clave2'));
  }

  ngOnInit(): void {
    //console.log(this.tipo_usuario);
    //this.userForm.markAllAsTouched();
    this.servSpinner.hideWithMessage('alta-usuario-init');
  }

  ngOnDestroy(): void {
    this.obras_sociales_suscription.unsubscribe();
    this.especialidades_suscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    if (changes['tipo_usuario']) {
      this.userForm.get('obra_social')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['paciente'])]);
      this.userForm.get('url_foto_2')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['paciente'])]);
      this.userForm.get('especialidades')?.setValidators([requeridoSegunTipoUsuario(this.tipo_usuario, ['especialista'])]);

      if (this.tipo_usuario === 'especialista') {
        this.userForm.get('edad')?.setValidators([
          Validators.required,
          Validators.min(18),
          Validators.max(99)
        ]);
      } else {
        this.userForm.get('edad')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(99)
        ]);
      }

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
      return (control.invalid && control.touched);
      //return control.invalid;
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
      }

      switch (usuario.tipo) {
        case "especialista":
          if (this.servAuth.usuarioActual.value && this.servAuth.usuarioActual.value.tipo == 'admin') {
            (usuario as Especialista).habilitado = true;
          } else {
            (usuario as Especialista).habilitado = false;
          }

          (usuario as Especialista).especialidades = this.getControlValue('especialidades').map((esp: Especialidad) => esp.id);
          (usuario as Especialista).disponibilidades = [];
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
            async () => {
              console.log('Usuario modificado');

              await this.servAuth.SetUsuarioActual();

              this.servSpinner.hideWithMessage('registrar-usuario');
              this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se registró su usuario. Recuerde verificar su mail para usar la aplicación.' });

              if (this.servAuth.usuarioActual.value && this.servAuth.usuarioActual.value.tipo != 'admin') {
                this.router.navigate(['/']);
              } else {
                this.UserCreated.emit();
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

    console.log("File 1 change", this.file_1);
    console.log("File 2 change", this.file_2);
  }
}
