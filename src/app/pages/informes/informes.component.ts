import { Component, OnInit } from '@angular/core';
import { IngresosComponent } from './componentes/ingresos/ingresos.component';
import { ButtonModule } from 'primeng/button';
import { GraficoTurnosPorEspecialidadComponent } from './componentes/grafico-turnos-por-especialidad/grafico-turnos-por-especialidad.component';
import { GraficoTurnosPorFechaComponent } from './componentes/grafico-turnos-por-fecha/grafico-turnos-por-fecha.component';
import { GraficoTurnosPorEspecialistaComponent } from './componentes/grafico-turnos-por-especialista/grafico-turnos-por-especialista.component';
import { GraficoTurnosFinalizadosPorEspecialistaComponent } from './componentes/grafico-turnos-finalizados-por-especialista/grafico-turnos-finalizados-por-especialista.component';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [
    IngresosComponent,
    GraficoTurnosPorEspecialidadComponent,
    GraficoTurnosPorFechaComponent,
    GraficoTurnosPorEspecialistaComponent,
    GraficoTurnosFinalizadosPorEspecialistaComponent,
    ButtonModule,
  ],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.scss'
})
export class InformesComponent implements OnInit {

  opcion_seleccionada: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  ElegirOpcion(opcion: string) {
    this.opcion_seleccionada = opcion;
  }

}
