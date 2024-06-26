import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { Observable, firstValueFrom } from "rxjs";

export function ExisteStringValidator(strings$: Observable<string[]>): AsyncValidatorFn {
    return (control: AbstractControl) => {
        const _valor: string = control.value.toString();

        return firstValueFrom(strings$).then(strings => {
            const existe = strings.find(_string => _string === _valor);
            return existe ? { existeString: true } : null;
        });
    };
}