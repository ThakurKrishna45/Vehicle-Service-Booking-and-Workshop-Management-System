import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates Indian vehicle registration numbers.
 * Format: XX00XX0000 (e.g., MH12AB1234, UP32XY9999)
 */
export function vehicleNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value?.toString().trim().toUpperCase() ?? '';
    if (!value) return null;

    // Indian vehicle number: 2 letters + 2 digits + 2 letters + 1-4 digits
    const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/;
    return pattern.test(value) ? null : { vehicleNumber: true };
  };
}