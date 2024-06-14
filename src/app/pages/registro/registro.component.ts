import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UsuarioFormComponent } from '../../componentes/usuario-form/usuario-form.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    UsuarioFormComponent
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  tipo_usuario: string = '';

  SeleccionarTipo(tipo_usuario: string) {
    console.log(tipo_usuario);
    this.tipo_usuario = tipo_usuario;
  }

}
