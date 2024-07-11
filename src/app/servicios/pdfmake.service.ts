import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Turno } from '../clases/turno';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { EspecialidadService } from './especialidad.service';
import { UsuarioService } from '../modulos/auth/servicios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PDFMakeService {
  logoBase64: string = "";

  constructor(public servEspecialidad: EspecialidadService, public servUsuario: UsuarioService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.cargarLogo(); // Cargar el logo al inicializar el servicio
  }

  private cargarLogo() {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx!.drawImage(img, 0, 0);
      this.logoBase64 = canvas.toDataURL('image/png');
    };
    img.src = 'assets/logos/main_logo.png';
  }

  generarPDFHistoriaClinica(turnos: Turno[], nombre_paciente: string): void {
    const docDefinition: TDocumentDefinitions = {
      content: [
        // Logo, título y fecha de emisión
        { image: this.logoBase64, width: 50, alignment: 'left' },
        { text: 'Historia Clínica', style: 'header' },
        { text: `Fecha de Emisión: ${new Date().toLocaleDateString('es-ES')}`, style: 'subheader' },
        { text: `Paciente: ${nombre_paciente}`, style: 'subheader' },

        // Información de los turnos
        ...turnos.map(turno => this.generarTablaHistoriaClinicaPorTurno(turno))
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 5, 0, 10] },
        tableHeader: { bold: true, fontSize: 13, color: 'black' }
      }
    };

    pdfMake.createPdf(docDefinition).download('historia-clinica.pdf');
  }

  private generarTablaHistoriaClinicaPorTurno(turno: Turno): any {
    const infoTurno = [
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Hora', style: 'tableHeader' },
      { text: 'Especialista', style: 'tableHeader' },
      { text: 'Especialidad', style: 'tableHeader' },
      { text: 'Comentario', style: 'tableHeader' }
    ];

    let _especialista: { nombre: string; apellido: string; } | undefined = this.servUsuario.ObtenerNombreApellidoUsuarioPorID(turno.id_especialista);

    const datosTurno = [
      [
        { text: turno.fecha.toLocaleDateString('es-ES') },
        { text: turno.hora },
        { text: _especialista ? _especialista.nombre + ", " + _especialista.apellido : '' },
        { text: this.servEspecialidad.obtenerEspecialidadPorId(turno.especialidad)?.nombre || '' },
        { text: turno.comentario.texto }
      ]
    ];

    // Historia clínica en una fila combinada
    const historiaClinicaText = Object.entries(turno.historia_clinica)
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
      .join('\n'); // Unir los elementos con saltos de línea

    return {
      table: {
        widths: ['*', '*', '*', '*', '*'],
        body: [
          infoTurno,
          ...datosTurno,
          [{ text: historiaClinicaText, colSpan: 5, style: 'historiaClinica' }] // Fila combinada para la historia clínica
        ]
      },
      layout: 'lightHorizontalLines',
      margin: [0, 10, 0, 10],
      styles: {
        // ... (otros estilos) ...
        historiaClinica: { margin: [0, 5, 0, 0] } // Estilo para la fila de la historia clínica
      }
    };
  }

  generarPDFGrafico(titulo: string, nombre_archivo: string, imagenBase64: string): void {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: titulo, style: 'header' },
        { text: `Fecha de Emisión: ${new Date().toLocaleDateString('es-ES')}`, style: 'subheader' },
        { image: imagenBase64, width: 500, alignment: 'center' }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 5, 0, 10] }
      }
    };

    pdfMake.createPdf(docDefinition).download(`${nombre_archivo}.pdf`);
  }
}
