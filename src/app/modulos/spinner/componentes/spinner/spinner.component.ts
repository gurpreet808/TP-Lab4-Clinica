import { Component, ElementRef, Renderer2 } from '@angular/core';
import { SpinnerService } from '../../servicios/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {

  canvas: HTMLElement | null = document.getElementById("spinner_canvas");

  constructor(
    public servSpinner: SpinnerService,
    private el: ElementRef,
    private renderer: Renderer2) {
  }

  ngOnInit() {
  }
}
