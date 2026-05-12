import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { fieldsMatch } from '../../../core/validators/fields-match';
import { FormErrorComponent } from '../../../shared/form-error/form-error.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotificationService } from '../../../shared/services/notification.service';
import { mapAuthError } from '../../../core/auth/auth-error.map';

@Component({
  selector: 'app-signup.component',
  imports: [ReactiveFormsModule, FormErrorComponent, RouterLink, IonicModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  signupForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: fieldsMatch('password', 'confirmPassword'),
    },
  );

  get formControls() {
    return this.signupForm.controls;
  }

  async onSubmit() {
    if (!this.signupForm.valid) return;

    try {
      const { username, email, name, surname, password } = this.signupForm.getRawValue();
      await this.authService.register(username, password, name, surname, email);
      this.notificationService.showToast('Account created! Please log in.');
      this.router.navigate(['/auth/login']);
    } catch (err: any) {
      const message = mapAuthError(err?.error?.error ?? err?.message);
      this.notificationService.showToast(message, true);
    }
  }
}
