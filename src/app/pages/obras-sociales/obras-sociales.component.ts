import { Component, OnInit } from '@angular/core';
import { ObraSocialService } from '../../servicios/obra-social.service';
import { ObraSocial } from '../../clases/obra-social';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-obras-sociales',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './obras-sociales.component.html',
  styleUrl: './obras-sociales.component.scss'
})
export class ObrasSocialesComponent implements OnInit {

  obra_social: string = '';
  editando_obras_sociales: { [s: string]: ObraSocial } = {};

  constructor(public servObraSocial: ObraSocialService, public messageService: MessageService) {

  }

  ngOnInit(): void {
  }

  AgregarObraSocial() {
    let _obra_social = {
      id: 'new',
      nombre: this.obra_social,
      valida: true
    }

    this.servObraSocial.Nuevo(_obra_social).then(
      (rdo) => {
        //console.log('ObraSocial agregada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se agregó la obra social' });
        this.obra_social = '';
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("CopiarRutaCheckOut", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    );
  }

  ModificarObraSocial(_obra_social: ObraSocial) {
    if (_obra_social.nombre == '' || _obra_social.nombre == null || _obra_social.nombre == undefined) {
      throw new Error('El nombre de la obra social no puede estar vacío');
    }

    this.servObraSocial.Modificar(_obra_social).then(
      (rdo) => {
        //console.log('ObraSocial modificada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se modificó la obra social' });
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("CopiarRutaCheckOut", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    );
  }

  BorrarObraSocial(id: string) {
    this.servObraSocial.Borrar(id).then(
      (rdo) => {
        console.log('ObraSocial borrada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se borró la obra social' });
      }
    ).catch(
      (error: any) => {
        if (typeof error === 'string') {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
        } else if (error instanceof Error) {
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
        } else {
          console.error("CopiarRutaCheckOut", error);
          this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
        }
      }
    );
  }

  onRowEditInit(obra_social: ObraSocial) {
    this.editando_obras_sociales[obra_social.id as string] = { ...obra_social };
  }

  onRowEditSave(obra_social: ObraSocial, index: number) {
    //console.log(obra_social);
    try {
      this.ModificarObraSocial(obra_social);
    } catch (error: any) {
      if (typeof error === 'string') {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      } else if (error instanceof Error) {
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error.message });
      } else {
        console.error("CopiarRutaCheckOut", error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: JSON.stringify(error) });
      }

      this.onRowEditCancel(obra_social, index);
    }
  }

  onRowEditCancel(obra_social: ObraSocial, index: number) {
    this.servObraSocial.obras_sociales.value[index] = this.editando_obras_sociales[obra_social.id];
    delete this.editando_obras_sociales[obra_social.id];
    //console.log(this.editando_obras_sociales);
  }

}
