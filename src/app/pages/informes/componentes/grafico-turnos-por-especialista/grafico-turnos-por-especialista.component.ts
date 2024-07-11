import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { UsuarioService } from '../../../../modulos/auth/servicios/usuario.service';
import { MessageService, SelectItem } from 'primeng/api';
import { SpinnerService } from '../../../../modulos/spinner/servicios/spinner.service';
import { PDFMakeService } from '../../../../servicios/pdfmake.service';
import { TurnoService } from '../../../../servicios/turno.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Turno } from '../../../../clases/turno';
import html2canvas from 'html2canvas';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-grafico-turnos-por-especialista',
  standalone: true,
  imports: [
    ChartModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './grafico-turnos-por-especialista.component.html',
  styleUrl: './grafico-turnos-por-especialista.component.scss'
})
export class GraficoTurnosPorEspecialistaComponent implements OnInit {
  fecha_inicio: Date | undefined;
  fecha_fin: Date | undefined;

  especialistas: SelectItem[] = [];
  especialista_seleccionado: string = '';

  tipoGrafico: ChartType = 'bar';
  datosGrafico: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Cantidad de Turnos', backgroundColor: ['#a855f7'] }
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
    private servUsuario: UsuarioService,
    private messageService: MessageService,
    private servSpinner: SpinnerService,
    private servPDFMake: PDFMakeService
  ) {
    this.servSpinner.showWithMessage('grafico-turnos-por-especialista-init', 'Cargando datos del gráfico...');

    this.especialistas = this.servUsuario.especialistas.value.map((especialista) => {
      return {
        label: especialista.nombre + ', ' + especialista.apellido,
        value: especialista.uid
      };
    });
  }

  ngOnInit() {
    this.servSpinner.hideWithMessage('grafico-turnos-por-especialista-init');
  }

  async generarGrafico() {
    if (this.validarFechas() && this.especialista_seleccionado) {
      this.servSpinner.showWithMessage('grafico-turnos-por-especialista-generar', 'Generando gráfico...');
      this.showGrafico = false;

      try {
        console.log("parametros", this.especialista_seleccionado, this.fecha_inicio, this.fecha_fin);
        const turnos = await firstValueFrom(this.servTurno.TraerTurnosOcupadosPorEspecialistaEntreFechas(new Date(this.fecha_inicio!), new Date(this.fecha_fin!.setHours(23, 59, 59, 0)), this.especialista_seleccionado));
        const turnosPorFecha: { [fecha: string]: number } = {};

        if (turnos == null || turnos == undefined || turnos.length == 0) {
          throw new Error("No se encontraron turnos para mostrar en el gráfico.");
        }

        console.log("Turnos por especialista:", turnos);

        if (turnos == undefined || turnos.length === 0) {
          throw new Error("No se encontraron turnos para el especialista seleccionado en el rango de fechas especificado.");
        }

        turnos.forEach((turno: Turno) => {
          const fecha = turno.fecha.toLocaleDateString('es-ES');

          if (turnosPorFecha[fecha]) {
            turnosPorFecha[fecha]++;
          } else {
            turnosPorFecha[fecha] = 1;
          }
        });

        const fechasOrdenadas = Object.keys(turnosPorFecha).reverse();
        // Ordenar las fechas de menor a mayor
        /* const fechasOrdenadas = Object.keys(turnosPorFecha).sort((a, b) => {
          const fechaA = new Date(a);
          const fechaB = new Date(b);
          return fechaA.getTime() - fechaB.getTime();
        }); */

        this.datosGrafico.labels = fechasOrdenadas;
        this.datosGrafico.datasets[0].data = fechasOrdenadas.map(fecha => turnosPorFecha[fecha]);
        this.showGrafico = true;
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
        this.servSpinner.hideWithMessage('grafico-turnos-por-especialista-generar');
      }
    }
  }

  private validarFechas(): boolean {
    if (!this.fecha_inicio || !this.fecha_fin) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'Seleccione las fechas de inicio y fin.' });
      return false;
    }

    if (this.fecha_inicio > this.fecha_fin) {
      this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
      return false;
    }

    return true;
  }

  async descargarPDF() {
    this.servSpinner.showWithMessage('generar-pdf-grafico', 'Generando PDF...');
    let elemento: HTMLElement | null = document.getElementById("grafico_turnos_por_especialista");

    try {
      const canvas = await html2canvas(elemento!);
      const imagenBase64 = canvas.toDataURL('image/png');

      this.servPDFMake.generarPDFGrafico(`Turnos por especialista desde ${this.fecha_inicio!.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} hasta ${this.fecha_fin!.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, 'turnos-por-especialista', imagenBase64);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el PDF del gráfico.' });
    } finally {
      this.servSpinner.hideWithMessage('generar-pdf-grafico');
    }
  }
}