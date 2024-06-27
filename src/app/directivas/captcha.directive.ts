import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaptcha]',
  standalone: true
})
export class CaptchaDirective implements OnInit {
  @Input() disabled: boolean = false;
  @Output() captchaResolved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() regenerarButtonLabel: string = 'Regenerar';
  @Input() validarButtonLabel: string = 'Validar';

  private captchaCode: string = "";
  private captchaContainer: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private inputElement: HTMLInputElement;
  private buttonsContainer: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.captchaCode = this.generateCaptchaCode(6);
    this.captchaContainer = this.renderer.createElement('div');
    this.canvas = this.renderer.createElement('canvas');
    this.inputElement = this.el.nativeElement;
    this.buttonsContainer = this.renderer.createElement('div');
  }

  ngOnInit() {
    this.initCaptchaContainer();
    this.drawCaptcha();
  }

  private initCaptchaContainer() {
    // Renombrar id input
    this.renderer.setAttribute(this.inputElement, 'id', 'captcha_input');

    // Configurar el contenedor
    this.renderer.setAttribute(this.captchaContainer, 'id', 'captcha');

    // Configurar el canvas
    this.renderer.setAttribute(this.canvas, 'id', 'captcha_canvas');
    this.renderer.setAttribute(this.canvas, 'width', '150');
    this.renderer.setAttribute(this.canvas, 'height', '50');

    // Agregar el canvas al contenedor
    this.renderer.appendChild(this.captchaContainer, this.canvas);

    // Insertar antes del input
    this.renderer.insertBefore(this.inputElement.parentNode, this.captchaContainer, this.inputElement);

    // Creo contenerdor para el input y container button
    const inputContainer = this.renderer.createElement('div');
    this.renderer.setAttribute(inputContainer, 'id', 'captcha_input_container');
    this.renderer.appendChild(inputContainer, this.inputElement);

    // Configurar el contenedor de los botones
    this.renderer.setAttribute(this.buttonsContainer, 'id', 'captcha_buttons_container');
    this.renderer.appendChild(inputContainer, this.buttonsContainer);

    // Crear los botones
    const refreshButton = this.createButton(this.regenerarButtonLabel, 'refresh', () => this.refreshCaptcha());
    const validateButton = this.createButton(this.validarButtonLabel, 'validate', () => this.validateCaptcha());

    // Agrego ids a los botones
    this.renderer.setAttribute(refreshButton, 'id', 'captcha_refresh_button');
    this.renderer.setAttribute(validateButton, 'id', 'captcha_validate_button');

    // Agregar los botones al contenedor
    this.renderer.appendChild(this.buttonsContainer, refreshButton);
    this.renderer.appendChild(this.buttonsContainer, validateButton);

    // Agregar el inputContainer al contenedor principal
    this.renderer.appendChild(this.captchaContainer, inputContainer);
  }

  private createButton(label: string, id: string, clickHandler: () => void): HTMLButtonElement {
    const button = this.renderer.createElement('button');
    this.renderer.setProperty(button, 'innerText', label);
    this.renderer.setAttribute(button, 'id', `captcha-${id}-button`);
    this.renderer.listen(button, 'click', clickHandler);
    return button;
  }

  private drawCaptcha() {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;

    // Limpiar el canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.filter = 'blur(1px)';

    // Color de fondo del canvas
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Color del texto
    ctx.fillStyle = '#333';
    ctx.font = '30px Arial';
    ctx.fillText(this.captchaCode, 10, 30);

    // Color de las líneas
    ctx.strokeStyle = '#888';

    // Color de los puntos
    ctx.fillStyle = '#888';

    for (let i = 0; i < 35; i++) {
      this.drawLine(ctx, this.canvas);
    }

    for (let i = 0; i < 35; i++) {
      this.drawDot(ctx, this.canvas);
    }
  }

  private refreshCaptcha() {
    if (!this.disabled) {
      this.captchaCode = this.generateCaptchaCode(6);
      this.drawCaptcha();
    }
  }

  private validateCaptcha() {
    const captchaValue = this.inputElement.value;
    if (captchaValue === this.captchaCode) {
      this.captchaResolved.emit(true);
    } else {
      this.captchaResolved.emit(false);
      this.refreshCaptcha();
    }
  }

  private generateCaptchaCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaCode = '';

    for (let i = 0; i < length; i++) {
      captchaCode += characters[Math.floor(Math.random() * characters.length)];
    }

    return captchaCode;
  }

  private drawLine(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  private drawDot(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}