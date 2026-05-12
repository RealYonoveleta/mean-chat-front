import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from './core/auth/services/token.service';
import { SocketService } from './core/socket/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private tokenService = inject(TokenService);
  private socketService = inject(SocketService);

  constructor() {
    // Reconnect socket on page refresh if the user is still authenticated
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isAuthenticated()) {
      this.socketService.connect(token);
    }
  }
}

