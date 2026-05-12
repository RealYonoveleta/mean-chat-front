import { inject, Injectable } from '@angular/core';
import { TokenService, TokenPayload } from '../auth/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private tokenService = inject(TokenService);

  getCurrentUser(): TokenPayload | null {
    return this.tokenService.getPayload();
  }
}
