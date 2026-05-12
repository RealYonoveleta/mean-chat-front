import { Component, computed, input } from '@angular/core';
import { Chat } from '../../../model/chat';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  imports: [DatePipe],
})
export class ChatWidgetComponent {
  private currentUserService = inject(CurrentUserService);
  chat = input<Chat>();

  title = computed(() => {
    const chat = this.chat();
    if (!chat) return '';
    if (chat.name) return chat.name;
    // For DMs, show the other member's name
    const me = this.currentUserService.getCurrentUser();
    const other = chat.members.find((m) => m._id !== me?.userId);
    return other ? `${other.name} ${other.surname}`.trim() || other.username : 'Chat';
  });

  lastMessage = computed(() => this.chat()?.lastMessage);
  lastMessageDate = computed(() => this.chat()?.updatedAt ? new Date(this.chat()!.updatedAt) : null);
}
