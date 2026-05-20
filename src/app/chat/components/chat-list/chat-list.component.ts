import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Chat } from '../../../model/chat';
import { ChatService } from '../../services/chat.service';
import { ChatListActionsComponent } from '../chat-list-actions/chat-list-actions.component';
import { ChatWidgetComponent } from '../chat-widget/chat-widget.component';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  imports: [IonicModule, ChatWidgetComponent, ChatListActionsComponent, RouterLink],
})
export class ChatListComponent implements OnInit {
  private chatService = inject(ChatService);
  private destroyRef = inject(DestroyRef);

  chats = signal<Chat[]>([]);

  ngOnInit(): void {
    this.chatService.getChats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((chats) => this.chats.set(chats));

    this.chatService.listenForNewChats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newChat) => {
        this.chats.update((current) => [newChat, ...current]);
      });

    this.chatService.listenForChatUpdates()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => {
        this.chats.update((current) => {
          const index = current.findIndex((c) => c._id === update._id);
          if (index === -1) return current;
          const updated: Chat = { ...current[index], lastMessage: update.lastMessage, updatedAt: update.updatedAt };
          return [updated, ...current.filter((_, i) => i !== index)];
        });
      });
  }

  onSelect(chat: Chat): void {
    this.chatService.setActiveChat(chat);
  }
}

