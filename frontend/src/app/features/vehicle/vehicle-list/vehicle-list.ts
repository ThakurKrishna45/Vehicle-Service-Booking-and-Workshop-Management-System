import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [RouterLink,DecimalPipe],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css'
})
export class VehicleList implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.vehicleService.getVehiclesByUser(userId).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => this.vehicles.set(data),
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  editVehicle(id: number): void {
    this.router.navigate(['/vehicles/edit', id]);
  }

  deleteVehicle(id: number): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    this.deletingId.set(id);
    this.vehicleService.deleteVehicle(id).pipe(
      finalize(() => this.deletingId.set(null))
    ).subscribe({
      next: () => this.vehicles.update(list => list.filter(v => v.id !== id)),
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }
}