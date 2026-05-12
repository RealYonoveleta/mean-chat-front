import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../../shared/form-error/form-error.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotificationService } from '../../../shared/services/notification.service';
import { mapAuthError } from '../../../core/auth/auth-error.map';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, FormErrorComponent, RouterLink, IonicModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get formControls() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (!this.loginForm.valid) return;

    try {
      const { username, password } = this.loginForm.getRawValue();
      await this.authService.login(username, password);
      this.router.navigate(['/home']);
    } catch (err: any) {
      const message = mapAuthError(err?.error?.error ?? err?.message);
      this.notificationService.showToast(message, true);
    }
  }
}

