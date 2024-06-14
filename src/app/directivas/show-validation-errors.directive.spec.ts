import { TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ShowValidationErrorsDirective } from './show-validation-errors.directive';
import { ValidatorMessage } from '../clases/validator-message';

// Componente de prueba para usar la directiva
@Component({
  template: `
    <form [formGroup]="form">
      <input type="text" id="testInput" formControlName="testControl" showValidationErrors [validationMessages]="validationMessages">
      <div id="errorContainer"></div>
    </form>
  `
})
class TestComponent {
  form = new FormGroup({
    testControl: new FormControl('', Validators.required)
  });

  validationMessages: ValidatorMessage = {
    required: 'Este campo es obligatorio.',
    min: 'El valor debe tener al menos {0} caracteres.',
    max: 'El valor debe tener como máximo {0} caracteres.',
    pattern: 'El valor no es válido.'
  };
}

describe('ShowValidationErrorsDirective', () => {
  let fixture: any;
  let component: TestComponent;
  let inputEl: DebugElement;
  let errorContainerEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestComponent, ShowValidationErrorsDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('#testInput'));
    errorContainerEl = fixture.debugElement.query(By.css('#errorContainer'));

    fixture.detectChanges(); // Inicializar el componente y la directiva
  });

  it('should create an instance', () => {
    const directive = inputEl.injector.get(ShowValidationErrorsDirective);
    expect(directive).toBeTruthy();
  });

  it('should display error message when control is invalid', () => {
    expect(errorContainerEl.nativeElement.textContent).toContain('Este campo es obligatorio.');
  });

  it('should clear error message when control is valid', () => {
    component.form.controls['testControl'].setValue('test');
    fixture.detectChanges(); // Actualizar la vista
    expect(errorContainerEl.nativeElement.textContent).toBe('');
  });
});