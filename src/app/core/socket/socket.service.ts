import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(environment.wsUrl, {
      auth: { token },
      autoConnect: true,
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  updateToken(token: string): void {
    if (!this.socket) return;
    this.socket.auth = { token };
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      const handler = (data: T) => observer.next(data);
      this.socket?.on(event, handler);
      return () => this.socket?.off(event, handler);
    });
  }

  off(event: string): void {
    this.socket?.off(event);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
