import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { MessageService } from 'primeng/api';
import { UserCredential } from '@angular/fire/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { SpinnerService } from '../../modulos/spinner/servicios/spinner.service';
import { Usuario } from '../../modulos/auth/clases/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  correo: string = '';
  clave: string = '';

  readonly ACCESO_RAPIDO = [
    { nombre: "Armando Paredes", mail: "armando@cj.MintEmail.com", tipo: "admin", clave: "Admin.1234", foto: "" },
    { nombre: "Cindy Entes", mail: "cindy@cj.MintEmail.com", tipo: "especialista", clave: "Especialista.1234", foto: "" },
    { nombre: "Elvis Tek", mail: "elvis@cj.MintEmail.com", tipo: "especialista", clave: "Especialista.1234" },
    { nombre: "Rubén Fermizo", mail: "ruben@cj.MintEmail.com", tipo: "paciente", clave: "Paciente.1234", foto: "" },
    { nombre: "Elba Lazo", mail: "elba@cj.MintEmail.com", tipo: "paciente", clave: "Paciente.1234", foto: "" },
    { nombre: "Elsa Pallo", mail: "elsa@cj.MintEmail.com", tipo: "paciente", clave: "Paciente.1234", foto: "" },
  ]

  constructor(public router: Router, public servAuth: AuthService, public servUsuario: UsuarioService, public messageService: MessageService, servSpinner: SpinnerService) {
    servSpinner.showWithMessage('login-init', 'Cargando...');
    this.servUsuario.Ready().then(
      (rta: any) => {
        this.AsignarFotos();
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("Ready", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    ).finally(
      () => {
        servSpinner.hideWithMessage('login-init');
      }
    );
  }

  ngOnInit(): void {
  }

  login() {
    this.servAuth.LogInEmail(this.correo, this.clave).then(
      (rta: UserCredential) => {
        //console.log("login credential", rta);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: `Te damos la bienvenida ${rta.user.email}` });
        this.router.navigate(['/']);
      }
    ).catch(
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: err.message });
        //this.messageService.add({ severity: 'error', life: 10000, summary: 'Error desconocido', detail: 'Revise la consola' });
      }
    );
  }

  olvideClave() {
    this.servAuth.OlvideClave(this.correo).then(
      (rta: any) => {
        console.log(rta);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Listo', detail: 'Se envió un correo a ' + this.correo + ' con un link para reestablecer la contraseña. REVISA SPAM' });
      }
    ).catch(
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: err.message });
        //this.messageService.add({ severity: 'error', life: 10000, summary: 'Error desconocido', detail: 'Revise la consola' });
      }
    );
  }

  SeveritySegunTipo(tipo: string): "success" | "info" | "warning" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined {
    switch (tipo) {
      case 'paciente':
        return 'info';
      case 'especialista':
        return 'success';
      case 'admin':
        return 'warning';
      default:
        return 'primary';
    }
  }

  AsignarFotos() {
    for (let a = 0; a < this.ACCESO_RAPIDO.length; a++) {
      this.servUsuario.BuscarUsuarioPorMail(this.ACCESO_RAPIDO[a].mail).then(
        (usuario: Usuario) => {
          this.ACCESO_RAPIDO[a].foto = usuario.url_foto_1;
        }
      ).catch(
        (error: any) => {
          if (typeof error === 'string') {
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
          } else if (error instanceof Error) {
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
          } else {
            console.error("AsignarFoto", error);
            this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
          }
        }
      );
    }
  }

  AccesoRapido(usuario: any) {
    this.correo = usuario.mail;
    this.clave = usuario.clave;
  }

}
