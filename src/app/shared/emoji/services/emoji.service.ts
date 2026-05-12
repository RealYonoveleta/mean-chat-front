import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Emoji, mapToEmojis } from '../emoji';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  private http = inject(HttpClient);

  private _emojis = signal<Emoji[]>([]);
  emojis = this._emojis.asReadonly();

  loadEmojis(): void {
    if (this._emojis().length === 0) {
      this.http
        .get<any[]>('https://emoji-api.com/emojis', {
          params: { access_key: environment.emojiApiKey },
        })
        .pipe(take(1), map(mapToEmojis))
        .subscribe((emojis) => this._emojis.set(emojis));
    }
  }
}
