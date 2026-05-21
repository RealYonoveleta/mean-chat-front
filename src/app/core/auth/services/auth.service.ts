import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenService } from './token.service';
import { SocketService } from '../../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private socketService = inject(SocketService);

  private _isAuthenticated = new BehaviorSubject<boolean>(this.tokenService.isAuthenticated());
  isAuthenticated$ = this._isAuthenticated.asObservable();

  async register(username: string, password: string, name: string, surname: string, email: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register`, { username, password, name, surname, email })
    );
  }

  async login(username: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ token: string; refreshToken: string }>(`${environment.apiUrl}/auth/login`, {
        username,
        password,
      })
    );
    this.tokenService.setTokens(response.token, response.refreshToken);
    this._isAuthenticated.next(true);
    this.socketService.connect(response.token);
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      void firstValueFrom(this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken })).catch(() => undefined);
    }

    this.tokenService.clearTokens();
    this._isAuthenticated.next(false);
    this.socketService.disconnect();
  }
}

