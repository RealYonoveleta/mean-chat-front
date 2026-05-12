import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CurrentUserService } from '../../../core/user/current-user.service';

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html',
  styleUrls: ['./account-panel.component.scss'],
  imports: [IonicModule],
})
export class AccountPanelComponent {
  private authService = inject(AuthService);
  private currentUserService = inject(CurrentUserService);
  private router = inject(Router);

  get displayName(): string {
    const user = this.currentUserService.getCurrentUser();
    if (!user) return '';
    return user.name ? `${user.name} ${user.surname}`.trim() : user.username;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

