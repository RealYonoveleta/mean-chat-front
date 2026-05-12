import { Injectable, signal } from '@angular/core';

export interface InsertOptions {
  toInsert: string;
  atCursor?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatInputService {
  private _toInsert = signal<InsertOptions | null>(null);
  toInsert = this._toInsert.asReadonly();

  requestInsert(toInsert: string | InsertOptions): void {
    if (typeof toInsert === 'string') {
      this._toInsert.set({ toInsert, atCursor: true });
      return;
    }
    this._toInsert.set(toInsert);
  }

  clearInsert(): void {
    this._toInsert.set(null);
  }
}
