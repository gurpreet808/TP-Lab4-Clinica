import { AbstractControl, ValidatorFn } from "@angular/forms";

export function requeridoSegunTipoUsuario(tipoUsuario: string, tiposRequeridos: string[]): ValidatorFn {
    return (control: AbstractControl) => {
        if (tiposRequeridos.includes(tipoUsuario) && !control.value) {
            return { required: true };
        }
        return null;
    };
}