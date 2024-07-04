import { Component, OnDestroy, OnInit } from '@angular/core';
import { TurnoService } from '../../servicios/turno.service';
import { Turno } from '../../clases/turno';
import { AuthService } from '../../modulos/auth/servicios/auth.service';
import { Subscription } from 'rxjs';
import { HistoriaClinicaComponent } from '../../componentes/historia-clinica/historia-clinica.component';
import { DialogModule } from 'primeng/dialog';
import { NombreApellidoUsuarioPipe } from '../../pipes/nombre-apellido-usuario.pipe';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    HistoriaClinicaComponent,
    DialogModule,
    ButtonModule,
    NombreApellidoUsuarioPipe,
    AsyncPipe
  ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit, OnDestroy {

  ids_pacientes: string[] = [];
  turnos_suscription: Subscription;

  paciente_seleccionado: string = '';
  showHistoriaClinica: boolean = false;

  constructor(public servTurnos: TurnoService, public servAuth: AuthService) {
    this.turnos_suscription = this.servTurnos.TraerTurnosPorEspecialistaPorEstado(this.servAuth.usuarioActual.value!.uid, 5).subscribe(
      (turnos: Turno[]) => {
        //check if id_paciente is already in the array, if not, add it
        turnos.forEach(
          (turno: Turno) => {
            if (!this.ids_pacientes.includes(turno.id_paciente)) {
              this.ids_pacientes.push(turno.id_paciente);
            }
          }
        );
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.turnos_suscription.unsubscribe();
  }

  OcultarHistoriaClinica() {
    this.showHistoriaClinica = false;
    this.paciente_seleccionado = '';
  }

  MostrarHistoriaClinica(id_paciente: string) {
    this.paciente_seleccionado = id_paciente;
    this.showHistoriaClinica = true;
  }
}
