import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { vehicleNumberValidator } from '../../../shared/validators/vehicle-number.validator';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-vehicle.html',
  styleUrl: './add-vehicle.css'
})
export class AddVehicle {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly vehicleTypes = ['Car', 'Motorcycle', 'SUV', 'Truck', 'Van'];
  readonly currentYear = new Date().getFullYear();

  // Dynamic form fields generated from configuration metadata
  readonly formFields = [
    { name: 'vehicleNumber', label: 'Vehicle Registration Number', type: 'text', placeholder: 'e.g. MH12AB1234' },
    { name: 'brand',         label: 'Brand',                        type: 'text', placeholder: 'e.g. Honda' },
    { name: 'model',         label: 'Model',                        type: 'text', placeholder: 'e.g. City' },
    { name: 'year',          label: 'Year of Manufacture',          type: 'number', placeholder: 'e.g. 2020' },
    { name: 'odometer',      label: 'Odometer Reading (km)',        type: 'number', placeholder: 'e.g. 15000' }
  ];

  readonly form = this.fb.nonNullable.group({
    vehicleNumber: ['', [Validators.required, vehicleNumberValidator()]],
    vehicleType:   ['Car', Validators.required],
    brand:         ['', [Validators.required, Validators.minLength(2)]],
    model:         ['', [Validators.required, Validators.minLength(1)]],
    year:          [this.currentYear, [Validators.required, Validators.min(1980), Validators.max(this.currentYear)]],
    odometer:      [0, [Validators.required, Validators.min(0)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = { ...this.form.getRawValue(), userId };
    // Normalize vehicle number to uppercase
    payload.vehicleNumber = payload.vehicleNumber.toUpperCase();

    this.vehicleService.addVehicle(payload).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => this.router.navigate(['/vehicles']),
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }
  getControl(name: string): AbstractControl | null {
  return this.form.get(name);
}
  get f() { return this.form.controls; }
}