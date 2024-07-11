import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { EspecialidadService } from '../../../../servicios/especialidad.service';
import { TurnoService } from '../../../../servicios/turno.service';
import { Turno } from '../../../../clases/turno';
import { SpinnerService } from '../../../../modulos/spinner/servicios/spinner.service';
import { ButtonModule } from 'primeng/button';
import { PDFMakeService } from '../../../../servicios/pdfmake.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-grafico-turnos-por-especialidad',
  standalone: true,
  imports: [
    ChartModule,
    ButtonModule
  ],
  templateUrl: './grafico-turnos-por-especialidad.component.html',
  styleUrl: './grafico-turnos-por-especialidad.component.scss'
})
export class GraficoTurnosPorEspecialidadComponent implements OnInit {

  tipoGrafico: ChartType = 'bar';
  datosGrafico: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad de Turnos', backgroundColor: ['#a855f7'] } // Personaliza el color
    ]
  };
  opcionesGrafico: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#495057' // Usa variables de color de PrimeNG
        }
      }
    }
  };
  showGrafico: boolean = false;

  constructor(
    private servTurno: TurnoService,
    private servEspecialidad: EspecialidadService,
    private messageService: MessageService,
    private servSpinner: SpinnerService,
    private servPDFMake: PDFMakeService
  ) {
    this.servSpinner.showWithMessage('grafico-turnos-por-especialidad-init', 'Cargando datos del gráfico...');
    this.obtenerDatosGrafico();
  }

  ngOnInit() {
    this.servSpinner.hideWithMessage('grafico-turnos-por-especialidad-init');
  }

  private async obtenerDatosGrafico() {
    try {
      const turnosPorEspecialidad = await this.ObtenerTurnosAgrupadosPorEspecialidad();

      this.datosGrafico.labels = Object.keys(turnosPorEspecialidad);
      this.datosGrafico.datasets[0].data = Object.values(turnosPorEspecialidad);
    } catch (error) {
      console.error("Error al obtener datos del gráfico:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los datos del gráfico.' });
    } finally {
      this.showGrafico = true;
    }
  }

  async ObtenerTurnosAgrupadosPorEspecialidad(): Promise<{ [especialidad: string]: number }> {
    const turnosPorEspecialidad: { [especialidad: string]: number } = {};

    await this.servTurno.Ready();
    await this.servEspecialidad.Ready();

    this.servTurno.turnos.value.forEach(
      (turno: Turno) => {
        const especialidad = this.servEspecialidad.obtenerEspecialidadPorId(turno.especialidad)?.nombre || 'Sin Especialidad';

        if (turnosPorEspecialidad[especialidad]) {
          turnosPorEspecialidad[especialidad]++;
        } else {
          turnosPorEspecialidad[especialidad] = 1;
        }
      });

    return turnosPorEspecialidad;
  }

  async DescargarPDF() {
    this.servSpinner.showWithMessage('generar-pdf-grafico', 'Generando PDF...');
    let elemento: HTMLElement | null = document.getElementById("grafico_turnos_por_especialidad");

    try {
      const canvas = await html2canvas(elemento!);
      const imagenBase64 = canvas.toDataURL('image/png');

      this.servPDFMake.generarPDFGrafico('Turnos por especialidad', 'turnos-por-especialidad', imagenBase64);
    } catch (error: any) {
      if (typeof error === 'string') {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      } else if (error instanceof Error) {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
      } else {
        console.error("DescargarPDF", error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
      }
    } finally {
      this.servSpinner.hideWithMessage('generar-pdf-grafico');
    }
  }
}