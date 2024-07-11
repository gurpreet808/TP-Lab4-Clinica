import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioItemComponent } from '../../componentes/usuario-item/usuario-item.component';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { HistoriaClinicaComponent } from '../../componentes/historia-clinica/historia-clinica.component';
import { PDFMakeService } from '../../servicios/pdfmake.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Turno } from '../../clases/turno';
import { ButtonModule } from 'primeng/button';
import { UsuarioService } from '../../modulos/auth/servicios/usuario.service';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    UsuarioItemComponent,
    MisHorariosComponent,
    HistoriaClinicaComponent,
    DropdownModule,
    ButtonModule,
    FormsModule,
    NombreApellidoUsuarioPipe,
    AsyncPipe
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent implements OnInit, OnDestroy {

  paciente_turnos: Turno[] = [];
  especialista_filtra_turnos: string = "";
  especialistas_options: string[] = [];

  constructor(public servAuth: AuthService, public servPDFMake: PDFMakeService, public servUsuario: UsuarioService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.paciente_turnos = [];
  }

  TurnosHandler(turnos: Turno[]) {
    console.log("TurnosHandler", turnos);
    this.paciente_turnos = turnos;

    this.especialistas_options = [];

    for (let turno of this.paciente_turnos) {
      if (this.especialistas_options.filter(especialista_option => especialista_option == turno.id_especialista).length == 0) {
        this.especialistas_options.push(turno.id_especialista);
      }
    }
  }

  ExportarPDF() {
    if (this.especialista_filtra_turnos == "" || this.especialista_filtra_turnos == null || this.especialista_filtra_turnos == undefined) {
      console.log("Todos");
      this.servPDFMake.generarPDFHistoriaClinica(this.paciente_turnos, this.servAuth.usuarioActual.value?.nombre + ", " + this.servAuth.usuarioActual.value?.apellido);
    } else {
      console.log("Especialista", this.especialista_filtra_turnos);
      this.servPDFMake.generarPDFHistoriaClinica(this.paciente_turnos.filter(t => t.id_especialista == this.especialista_filtra_turnos), this.servAuth.usuarioActual.value?.nombre + ", " + this.servAuth.usuarioActual.value?.apellido);
    }
  }
}
