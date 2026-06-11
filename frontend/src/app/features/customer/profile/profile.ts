import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly profileService = inject(ProfileService);

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  // Reactive Form for main profile details
  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
  });

  // Template-Driven Form model for preferences
  preferences = {
    serviceReminders: true,
    preferredSlot: 'Morning',
    notificationEmail: true,
    notificationSms: false
  };

  readonly slotOptions = ['Morning', 'Afternoon', 'Evening'];

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user?.id) return;

    this.isLoading.set(true);
    this.profileService.getUserById(user.id).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (u) => {
        this.profileForm.patchValue({ name: u.name, email: u.email, phone: u.phone });
      },
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.profileService.updateProfile(userId, this.profileForm.getRawValue()).pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => this.successMessage.set('Profile updated successfully!'),
      error: (err: Error) => this.errorMessage.set(err.message)
    });
  }

  savePreferences(): void {
    this.successMessage.set('Preferences saved successfully!');
    // Preferences are local/signal state; persist to user record if backend supports it
  }

  get f() { return this.profileForm.controls; }
}