import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { TurnoService } from '../../../../servicios/turno.service';
import { Turno } from '../../../../clases/turno';
import { SpinnerService } from '../../../../modulos/spinner/servicios/spinner.service';
import { ButtonModule } from 'primeng/button';
import { PDFMakeService } from '../../../../servicios/pdfmake.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-grafico-turnos-por-fecha',
  standalone: true,
  imports: [
    ChartModule,
    ButtonModule
  ],
  templateUrl: './grafico-turnos-por-fecha.component.html',
  styleUrl: './grafico-turnos-por-fecha.component.scss'
})
export class GraficoTurnosPorFechaComponent implements OnInit {

  tipoGrafico: ChartType = 'bar';
  datosGrafico: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad de Turnos', backgroundColor: ['#4ade80'] }
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
          color: '#495057'
        }
      }
    }
  };
  showGrafico: boolean = false;

  constructor(
    private servTurno: TurnoService,
    private messageService: MessageService,
    private servSpinner: SpinnerService,
    private servPDFMake: PDFMakeService
  ) {
    this.servSpinner.showWithMessage('grafico-turnos-por-fecha-init', 'Cargando datos del gráfico...');
    this.obtenerDatosGrafico();
  }

  ngOnInit() {
    this.servSpinner.hideWithMessage('grafico-turnos-por-fecha-init');
  }

  private async obtenerDatosGrafico() {
    try {
      const turnosPorFecha = await this.ObtenerTurnosAgrupadosPorFecha();

      if (turnosPorFecha == null || turnosPorFecha == undefined || Object.keys(turnosPorFecha).length == 0) {
        throw new Error("No se encontraron turnos para mostrar en el gráfico.");
      }

      const fechasOrdenadas = Object.keys(turnosPorFecha).reverse();
      //Revisar ordenamiento de fechas, o pasar esto a la funcion ObtenerTurnosAgrupadosPorFecha
      /* const fechasOrdenadas = Object.keys(turnosPorFecha).sort((a, b) => {
        const fechaA = new Date(a);
        const fechaB = new Date(b);
        return fechaA.getTime() - fechaB.getTime();
      }); */
      //console.log(fechasOrdenadas);

      this.datosGrafico.labels = fechasOrdenadas;
      this.datosGrafico.datasets[0].data = fechasOrdenadas.map(fecha => turnosPorFecha[fecha]);
      this.showGrafico = true;
    } catch (error: any) {
      if (typeof error === 'string') {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      } else if (error instanceof Error) {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
      } else {
        console.error("GuardarCambios", error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
      }
    }
  }

  async ObtenerTurnosAgrupadosPorFecha(): Promise<{ [fecha: string]: number }> {
    const turnosPorFecha: { [fecha: string]: number } = {};

    await this.servTurno.Ready();

    this.servTurno.turnos.value.forEach((turno: Turno) => {
      const fecha = turno.fecha.toLocaleDateString('es-ES'); // Obtener la fecha en formato dd/mm/yyyy

      if (turnosPorFecha[fecha]) {
        turnosPorFecha[fecha]++;
      } else {
        turnosPorFecha[fecha] = 1;
      }
    });

    return turnosPorFecha;
  }

  async DescargarPDF() {
    this.servSpinner.showWithMessage('generar-pdf-grafico', 'Generando PDF...');
    let elemento: HTMLElement | null = document.getElementById("grafico_turnos_por_fecha");

    try {
      const canvas = await html2canvas(elemento!);
      const imagenBase64 = canvas.toDataURL('image/png');

      this.servPDFMake.generarPDFGrafico('Turnos por fecha', 'turnos-por-fecha', imagenBase64);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el PDF del gráfico.' });
    } finally {
      this.servSpinner.hideWithMessage('generar-pdf-grafico');
    }
  }
}