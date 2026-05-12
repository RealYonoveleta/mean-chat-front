import { Component, computed, inject, input } from '@angular/core';
import { Chat } from '../../../model/chat';
import { CurrentUserService } from '../../../core/user/current-user.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
  private currentUserService = inject(CurrentUserService);
  chat = input<Chat | null>(null);

  title = computed(() => {
    const chat = this.chat();
    if (!chat) return '';
    if (chat.name) return chat.name;
    const me = this.currentUserService.getCurrentUser();
    const other = chat.members.find((m) => m._id !== me?.userId);
    return other ? `${other.name} ${other.surname}`.trim() || other.username : 'Chat';
  });
}
