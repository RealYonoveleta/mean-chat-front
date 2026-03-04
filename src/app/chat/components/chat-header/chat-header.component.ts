import { Component, computed, input } from '@angular/core';
import { Chat } from '../../../model/chat';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
  chat = input<Chat | null>(null);

  title = computed(() => this.chat()?.title);
}
