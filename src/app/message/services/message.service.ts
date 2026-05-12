import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, MessageType } from '../../model/message';
import { Location } from '../../core/location/models/location';
import { SocketService } from '../../core/socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private socketService = inject(SocketService);

  getMessageHistory(chatId: string, page: number = 1, limit: number = 30): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${environment.apiUrl}/chat/${chatId}/messages?page=${page}&limit=${limit}`
    );
  }

  listenForMessages(): Observable<Message> {
    return this.socketService.on<Message>('chat-message');
  }

  sendMessage(content: string): void {
    this.socketService.emit('chat-message', { content, type: MessageType.Text });
  }

  sendLocationMessage(location: Location): void {
    this.socketService.emit('chat-message', { content: location, type: MessageType.Location });
  }
}

