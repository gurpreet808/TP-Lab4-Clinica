import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../modulos/auth/servicios/auth.service';
import { LoginLog } from '../../../../modulos/auth/clases/usuario';
import { SpinnerService } from '../../../../modulos/spinner/servicios/spinner.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { WorkSheet, read, utils, writeFile } from 'xlsx';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule
  ],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss'
})
export class IngresosComponent implements OnInit {

  login_logs: LoginLog[] = [];

  constructor(public servAuth: AuthService, public servSpinner: SpinnerService, public messageService: MessageService,) {
    this.servSpinner.showWithMessage('ingresos-init', 'Cargando registros de ingreso...');

    this.servAuth.TraerLoginLogs().then(
      (logs: LoginLog[]) => {
        this.login_logs = logs;
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("TraerLoginLogs", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    ).finally(
      () => {
        this.servSpinner.hideWithMessage('ingresos-init');
      }
    );
  }

  ngOnInit(): void {
  }

  DescargarExcel() {
    const datos = this.login_logs.map(log => {
      return {
        Usuario: log.usuario,
        Fecha: log.fecha,
        Hora: log.hora
      };
    });

    this.ExportArrayToExcel([{ items: datos, nombreHoja: 'Ingresos' }], 'Ingresos');
  }

  ExportArrayToExcel(datos: { items: any[], nombreHoja: string }[], nombreArchivo: string) {
    const workbook = utils.book_new();

    for (let i = 0; i < datos.length; i++) {
      const worksheet = utils.json_to_sheet(datos[i].items);
      utils.book_append_sheet(workbook, worksheet, datos[i].nombreHoja);
    }

    writeFile(workbook, nombreArchivo + '.xlsx');
  }
}
