import { Injectable, Type } from '@angular/core';
import { EmojiTabComponent } from '../components/emoji-tab/emoji-tab.component';
import { GifTabComponent } from '../components/gif-tab/gif-tab.component';
import { StickerTabComponent } from '../components/sticker-tab/sticker-tab.component';

export enum TabType {
  Emoji = 'emoji',
  Gif = 'gif',
  Sticker = 'sticker',
}

@Injectable({
  providedIn: 'root',
})
export class TabRegistry {
  private registry = new Map<TabType, Type<any>>([
    [TabType.Emoji, EmojiTabComponent],
    [TabType.Gif, GifTabComponent],
    [TabType.Sticker, StickerTabComponent],
  ]);

  getComponentFor(type: TabType): Type<any> | null {
    return this.registry.get(type) ?? null;
  }
}
