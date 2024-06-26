import { Directive, ElementRef, Input, OnDestroy, OnInit, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ValidatorMessage } from '../clases/validator-message';
import { Subscription, fromEvent } from 'rxjs';

@Directive({
  selector: '[showValidationErrors]',
  standalone: true
})
export class ShowValidationErrorsDirective implements OnInit, OnDestroy {
  @Input() validationMessages: ValidatorMessage | undefined;
  @Input() errorContainerId: string = '';
  statusChangesSuscription: Subscription | undefined;
  blurSubscription: Subscription | undefined;

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    if (this.ngControl && this.ngControl.control) {
      //this.updateErrorMessages();

      this.statusChangesSuscription = this.ngControl.control.statusChanges.subscribe(() => {
        this.updateErrorMessages();
      });

      this.blurSubscription = fromEvent(this.elementRef.nativeElement, 'blur').subscribe(() => {
        this.updateErrorMessages();
      });
    }
  }

  ngOnDestroy() {
    if (this.statusChangesSuscription) {
      this.statusChangesSuscription.unsubscribe();
    }

    if (this.blurSubscription) {
      this.blurSubscription.unsubscribe();
    }
  }

  private updateErrorMessages() {
    const control = this.ngControl.control;
    const messages: string[] = [];

    if (!this.validationMessages) {
      return;
    }

    if (control && control.invalid && (control.dirty || control.touched)) {
      for (const errorKey of Object.keys(control.errors || {})) {
        let message: string = '';

        if (this.validationMessages[errorKey]) {
          message = this.validationMessages[errorKey];

          if (errorKey === 'min' || errorKey === 'max') {
            if (control.errors && control.errors[errorKey][errorKey]) {
              message = message.replace('{requiredLength}', control.errors![errorKey][errorKey]);
            }
          }

        }

        // Manejar errores con propiedad 'mensaje'
        if (control.errors && control.errors[errorKey] && control.errors[errorKey].mensaje) {
          message = control.errors[errorKey].mensaje;
        }

        if (message) {
          messages.push(message);
        }
      }
    }

    const errorMessagesContainer = this.renderer.selectRootElement(`#${this.errorContainerId}`);

    if (errorMessagesContainer) {
      this.renderer.setProperty(errorMessagesContainer, 'innerHTML', '');

      for (const msg of messages) {
        const messageElement = this.renderer.createElement('small');
        this.renderer.setProperty(messageElement, 'innerHTML', msg);
        this.renderer.appendChild(errorMessagesContainer, messageElement);
      }
    } else {
      console.error(`Error: No se encontró el contenedor de errores con ID '${this.errorContainerId}'.`);
    }
  }
}