import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { EstadoTurno } from '../clases/turno';

@Directive({
  selector: '[resaltarEstadoTurno]',
  standalone: true
})
export class ResaltarEstadoTurnoDirective implements OnChanges {
  @Input() estadoTurno: EstadoTurno | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges() {
    this.aplicarEstilos();
  }

  private aplicarEstilos() {
    this.renderer.removeClass(this.el.nativeElement, 'turno-pendiente');
    this.renderer.removeClass(this.el.nativeElement, 'turno-aceptado');
    this.renderer.removeClass(this.el.nativeElement, 'turno-rechazado');
    this.renderer.removeClass(this.el.nativeElement, 'turno-cancelado');
    this.renderer.removeClass(this.el.nativeElement, 'turno-finalizado');

    if (this.estadoTurno) {
      switch (this.estadoTurno) {
        case EstadoTurno.Pendiente:
          this.renderer.addClass(this.el.nativeElement, 'turno-pendiente');
          break;
        case EstadoTurno.Aceptado:
          this.renderer.addClass(this.el.nativeElement, 'turno-aceptado');
          break;
        case EstadoTurno.Rechazado:
          this.renderer.addClass(this.el.nativeElement, 'turno-rechazado');
          break;
        case EstadoTurno.Cancelado:
          this.renderer.addClass(this.el.nativeElement, 'turno-cancelado');
          break;
        case EstadoTurno.Finalizado:
          this.renderer.addClass(this.el.nativeElement, 'turno-finalizado');
          break;
      }
    }
  }
}