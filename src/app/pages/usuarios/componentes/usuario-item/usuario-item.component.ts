import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Especialista, Paciente, Usuario } from '../../../../modulos/auth/clases/usuario';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EspecialidadPipe } from '../../../../pipes/especialidad.pipe';
import { ObraSocialPipe } from '../../../../pipes/obra-social.pipe';

@Component({
  selector: 'app-usuario-item',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    DatePipe,
    EspecialidadPipe,
    ObraSocialPipe,
    AsyncPipe
  ],
  templateUrl: './usuario-item.component.html',
  styleUrl: './usuario-item.component.scss'
})
export class UsuarioItemComponent implements OnInit {
  @Input() usuario: Usuario | Paciente | Especialista | undefined;
  @Output() action = new EventEmitter<{ action: string, item: Usuario }>();

  constructor() { }

  ngOnInit(): void {
    //check if usuario is type of Paciente or Especialista
  }

  ToogleHabilitarEspecialista(){
    this.ActionEmmiter('habilitar-especialista');
  }

  ActionEmmiter(action: string) {
    if (this.usuario == undefined) {
      console.error('Usuario no definido');
      return;
    }

    this.action.emit({ action: action, item: this.usuario });
  }

  GetUserAsPaciente() {
    return this.usuario as Paciente;
  }

  GetUserAsEspecialista() {
    return this.usuario as Especialista;
  }
}
