import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-account-panel',
  templateUrl: './account-panel.component.html',
  styleUrls: ['./account-panel.component.scss'],
  imports: [IonicModule],
})
export class AccountPanelComponent {
  private authService = inject(AuthService);

  private user = toSignal(this.authService.user$, { initialValue: null });
  displayName = computed(() => this.user()?.displayName);

  async logout() {
    await this.authService.signOut();
  }
}
