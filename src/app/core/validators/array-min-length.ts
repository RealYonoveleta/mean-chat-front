import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function arrayMinLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as any[];

    if (!value || value.length < min) {
      return { arrayMinLength: { requiredLength: min } };
    }

    return null;
  };
}
