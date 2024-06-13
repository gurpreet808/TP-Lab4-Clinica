import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { MessageService } from 'primeng/api';
import { UserCredential } from '@angular/fire/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  correo: string = '';
  clave: string = '';

  readonly ACCESO_RAPIDO = [
    { nombre: "Esteban Quito", mail: "esteban@cj.MintEmail.com", tipo: "paciente", clave: "1q2w3e4r5t", foto: "" },
    { nombre: "Elsa Pallo", mail: "elsa@cj.MintEmail.com", tipo: "paciente", clave: "1q2w3e4r5t", foto: "" },
    { nombre: "Elvis Tek", mail: "elvis@cj.MintEmail.com", tipo: "especialista", clave: "1q2w3e4r5t" },
    { nombre: "Armando Paredes", mail: "admin@cj.MintEmail.com", tipo: "admin", clave: "1q2w3e4r5t", foto: "" },
  ]

  constructor(public router: Router, public servAuth: AuthService, public messageService: MessageService) {
    /* //Luego se reemplaza por guard
    this.servAuth.IsLoggedIn().then(
      (rta: any) => {
        //console.log(rta);
        if (rta) {
          this.router.navigate(['/']);
        }
      }
    ); */
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

  AccesoRapido(usuario: any) {
    this.correo = usuario.mail;
    this.clave = usuario.clave;
  }

  Registrarse() {
    this.router.navigate(['/registrarse']);
  }

}
