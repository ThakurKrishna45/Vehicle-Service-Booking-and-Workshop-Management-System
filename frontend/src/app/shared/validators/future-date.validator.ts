import { AbstractControl } from '@angular/forms';

export function futureDateValidator(
  control: AbstractControl
) {

  if (!control.value) {
    return null;
  }

  const selectedDate =
    new Date(control.value);

  const today =
    new Date();

  today.setHours(0,0,0,0);

  return selectedDate < today
    ? { invalidDate: true }
    : null;

}