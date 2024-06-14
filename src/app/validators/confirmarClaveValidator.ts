import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function confirmarCalveValidator(clave1_fieldname: string, clave2_fieldname: string): ValidatorFn | ValidatorFn[] | null {
    return (formGroup: AbstractControl): ValidationErrors | null => {

        const clave = formGroup.get(clave1_fieldname);
        const repiteClave = formGroup.get(clave2_fieldname);
        const respuestaError = { noCoincide: 'La clave no coincide' };

        if (clave != null && repiteClave != null) {
            if (clave.value !== repiteClave.value) {
                repiteClave.setErrors(respuestaError);
                return respuestaError;
            } else {
                if (repiteClave.errors != null) {
                    repiteClave.errors['noCoincide'] = null;
                }
                //repiteClave.setErrors(null);
            }
        }

        return null;
    };
}