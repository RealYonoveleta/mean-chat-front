import { Component, computed, inject } from '@angular/core';
import { ChatInputService } from '../../../../chat/services/chat-input.service';
import { Emoji } from '../../../emoji/emoji';
import { EmojiService } from '../../../emoji/services/emoji.service';

@Component({
  selector: 'app-emoji-tab',
  templateUrl: './emoji-tab.component.html',
  styleUrls: ['./emoji-tab.component.scss'],
})
export class EmojiTabComponent {
  private emojiService = inject(EmojiService);
  private chatInputService = inject(ChatInputService);

  emojis = computed(() => this.emojiService.emojis());

  constructor() {
    this.emojiService.loadEmojis();
  }

  selectEmoji(emoji: Emoji): void {
    this.chatInputService.requestInsert(emoji.emoji);
  }
}
