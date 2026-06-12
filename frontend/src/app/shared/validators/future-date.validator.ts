import { AbstractControl, ValidationErrors } from '@angular/forms';

export function futureDateValidator(
  control: AbstractControl
): ValidationErrors | null {

  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate < today
    ? { invalidDate: true }
    : null;

}