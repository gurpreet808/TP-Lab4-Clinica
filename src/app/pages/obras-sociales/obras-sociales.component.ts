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
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se agregó la obra_social' });
        this.obra_social = '';
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

  ModificarObraSocial(_obra_social: ObraSocial) {
    this.servObraSocial.Modificar(_obra_social).then(
      (rdo) => {
        //console.log('ObraSocial modificada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se modificó la obra_social' });
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

  BorrarObraSocial(id: string) {
    this.servObraSocial.Borrar(id).then(
      (rdo) => {
        console.log('ObraSocial borrada', rdo);
        this.messageService.add({ severity: 'success', life: 10000, summary: 'Bien', detail: 'Se borró la obra_social' });
      }
    ).catch(
      (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', life: 10000, summary: 'Error', detail: error });
      }
    );
  }

}
