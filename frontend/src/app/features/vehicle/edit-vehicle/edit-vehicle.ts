import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { VehicleService } from '../../../core/services/vehicle.service';
import { vehicleNumberValidator } from '../../../shared/validators/vehicle-number.validator';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-vehicle.html',
  styleUrl: '../add-vehicle/add-vehicle.css'
})
export class EditVehicle implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly vehicleTypes = ['Car', 'Motorcycle', 'SUV', 'Truck', 'Van'];
  readonly currentYear = new Date().getFullYear();

  // Store as string to preserve json-server IDs like "1", "2"
  private vehicleId!: string;

  readonly form = this.fb.nonNullable.group({
    vehicleNumber: ['', [Validators.required, vehicleNumberValidator()]],
    vehicleType:   ['Car', Validators.required],
    brand:         ['', [Validators.required, Validators.minLength(2)]],
    model:         ['', Validators.required],
    year:          [this.currentYear, [Validators.required, Validators.min(1980), Validators.max(this.currentYear)]],
    odometer:      [0, [Validators.required, Validators.min(0)]]
  });

  readonly formFields = [
    { name: 'vehicleNumber', label: 'Vehicle Registration Number', type: 'text',   placeholder: 'e.g. MH12AB1234' },
    { name: 'brand',         label: 'Brand',                        type: 'text',   placeholder: 'e.g. Honda'       },
    { name: 'model',         label: 'Model',                        type: 'text',   placeholder: 'e.g. City'        },
    { name: 'year',          label: 'Year of Manufacture',          type: 'number', placeholder: 'e.g. 2020'        },
    { name: 'odometer',      label: 'Odometer Reading (km)',        type: 'number', placeholder: 'e.g. 15000'       }
  ];

  ngOnInit(): void {
    // Read the route param as a string — json-server uses string IDs
    this.vehicleId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.vehicleId) {
      this.router.navigate(['/vehicles']);
      return;
    }

    this.loadVehicle();
  }

  private loadVehicle(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.vehicleService.getVehicleById(this.vehicleId).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (vehicle) => {
        this.form.patchValue({
          vehicleNumber: vehicle.vehicleNumber,
          vehicleType:   vehicle.vehicleType,
          brand:         vehicle.brand,
          model:         vehicle.model,
          year:          vehicle.year,
          odometer:      vehicle.odometer
        });
      },
      error: (err: Error) => this.errorMessage.set(err.message || 'Failed to load vehicle details.')
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = {
      ...this.form.getRawValue(),
      vehicleNumber: this.form.getRawValue().vehicleNumber.toUpperCase()
    };

    this.vehicleService.updateVehicle(this.vehicleId, payload).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => this.router.navigate(['/vehicles']),
      error: (err: Error) => this.errorMessage.set(err.message || 'Failed to update vehicle.')
    });
  }

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  get f() {
    return this.form.controls;
  }
}