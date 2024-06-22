import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EspecialidadService } from '../../servicios/especialidad.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Especialidad } from '../../clases/especialidad';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss'
})
export class EspecialidadesComponent implements OnInit {

  especialidad: string = '';
  editando_especialidades: { [s: string]: Especialidad } = {};

  constructor(public servEspecialidad: EspecialidadService, public messageService: MessageService) {

  }

  ngOnInit(): void {
  }

  AgregarEspecialidad() {
    let _especialidad = {
      id: 'new',
      nombre: this.especialidad,
      valida: true
    }

    this.servEspecialidad.Nuevo(_especialidad).then(
      (rdo) => {
        //console.log('Especialidad agregada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se agregó la especialidad' });
        this.especialidad = '';
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

  ModificarEspecialidad(_especialidad: Especialidad) {
    this.servEspecialidad.Modificar(_especialidad).then(
      (rdo) => {
        //console.log('Especialidad modificada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se modificó la especialidad' });
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

  BorrarEspecialidad(id: string) {
    this.servEspecialidad.Borrar(id).then(
      (rdo) => {
        console.log('Especialidad borrada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se borró la especialidad' });
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

  ToogleValidarEspecialidad(_especialidad: Especialidad) {
    this.servEspecialidad.ToogleValidarEspecialidad(_especialidad).then(
      (rdo) => {
        console.log('Especialidad cambio validación', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se cambió la validación de la especialidad' });
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

  onRowEditInit(especialidad: Especialidad) {
    this.editando_especialidades[especialidad.id as string] = { ...especialidad };
  }

  onRowEditSave(especialidad: Especialidad, index: number) {
    //console.log(especialidad);
    try {
      this.ModificarEspecialidad(especialidad);
    } catch (error: any) {
      if (typeof error === 'string') {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      } else if (error instanceof Error) {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
      } else {
        console.error("CopiarRutaCheckOut", error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
      }

      this.onRowEditCancel(especialidad, index);
    }
  }

  onRowEditCancel(especialidad: Especialidad, index: number) {
    this.servEspecialidad.especialidades.value[index] = this.editando_especialidades[especialidad.id];
    delete this.editando_especialidades[especialidad.id];
    //console.log(this.editando_especialidades);
  }

}
