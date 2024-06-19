import { Directive, Input, OnInit, Optional, Renderer2, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ValidatorMessage } from '../clases/validator-message';

@Directive({
  selector: '[showValidationErrors]',
  standalone: true
})
export class ShowValidationErrorsDirective implements OnInit {
  @Input() validationMessages: ValidatorMessage | undefined;
  @Input() errorContainerId: string = '';

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    if (this.ngControl) {
      this.updateErrorMessages();

      this.ngControl.control?.statusChanges!.subscribe(() => {
        this.updateErrorMessages();
      });
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
        if (this.validationMessages[errorKey]) {
          let message = this.validationMessages[errorKey];

          if (errorKey === 'min' || errorKey === 'max') {
            if (control.errors && control.errors[errorKey][errorKey]) {
              message = message.replace('{requiredLength}', control.errors![errorKey][errorKey]);
            }
          }

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