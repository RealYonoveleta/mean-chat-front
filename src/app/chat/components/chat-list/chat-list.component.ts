import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
import { CurrentUserService } from '../../../core/user/current-user.service';
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
export class ChatListComponent {
  private chatService = inject(ChatService);
  private currentUserService = inject(CurrentUserService);

  private chats$ = this.currentUserService.currentUser$.pipe(
    switchMap((user) => (user ? this.chatService.getChats(user.uid!) : of([]))),
  );

  chats = toSignal(this.chats$, { initialValue: [] });

  onSelect(chat: Chat) {
    this.chatService.setActiveChat(chat);
  }
}
