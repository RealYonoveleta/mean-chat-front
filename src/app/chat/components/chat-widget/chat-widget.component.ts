import { Component, computed, input } from '@angular/core';
import { Chat } from '../../../model/chat';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
})
export class ChatWidgetComponent {
  chat = input<Chat>();

  title = computed(() => this.chat()?.title);
  lastMessage = computed(() => this.chat()?.lastMessage);
}
