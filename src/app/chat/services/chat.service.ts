import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chat } from '../../model/chat';
import { SocketService } from '../../core/socket/socket.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private socketService = inject(SocketService);
  private notificationService = inject(NotificationService);

  private chat = new BehaviorSubject<Chat | null>(null);
  chat$ = this.chat.asObservable();

  setActiveChat(chat: Chat): void {
    this.chat.next(chat);
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${environment.apiUrl}/chat`);
  }

  async createChat(members: string[], name: string, isGroup: boolean): Promise<void> {
    await firstValueFrom(this.http.post<Chat>(`${environment.apiUrl}/chat`, { members, name, isGroup }));
    this.notificationService.showToast(`Chat "${name}" created successfully`);
  }

  listenForNewChats(): Observable<Chat> {
    return this.socketService.on<Chat>('chat-created');
  }
}

