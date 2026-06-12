import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../auth.css'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);
    this.auth.login(this.form.getRawValue()).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
     next: (user) => {

  const returnUrl =
    this.router.parseUrl(this.router.url)
      .queryParams['returnUrl'];

  if (returnUrl) {
    this.router.navigateByUrl(returnUrl);
    return;
  }

  if (user.role === 'admin') {

    this.router.navigateByUrl('/admin');

  } else {

    this.router.navigateByUrl('/dashboard');

  }

},
      error: (error: Error) => this.errorMessage.set(error.message)
    });
  }
}
