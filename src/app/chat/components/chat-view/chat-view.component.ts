import { Component, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IonContent, IonicModule } from '@ionic/angular';
import { MessageListComponent } from '../../../message/components/message-list/message-list.component';
import { ChatService } from '../../services/chat.service';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { BehaviorSubject, of, switchMap, tap } from 'rxjs';
import { MessageService } from '../../../message/services/message.service';
import { Message } from '../../../model/message';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
  imports: [ChatHeaderComponent, MessageListComponent, IonicModule, ChatInputComponent],
})
export class ChatViewComponent implements OnInit {
  private chatService = inject(ChatService);
  private messageService = inject(MessageService);

  chat = toSignal(this.chatService.chat$, { initialValue: null });

  content = viewChild<IonContent>('content');

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private messages$ = this.messagesSubject.asObservable();

  messages = toSignal(this.messages$, { initialValue: [] });

  private isLoadingOlder: boolean = false;

  ngOnInit() {
    this.chatService.chat$
      .pipe(
        switchMap((chat) => (chat ? this.messageService.getLatestMessages(chat.uid!) : of([]))),
        tap(() => this.scrollToBottom()),
        takeUntilDestroyed(),
      )
      .subscribe((messages) => this.messagesSubject.next(messages));
  }

  private scrollToBottom() {
    setTimeout(() => this.content()?.scrollToBottom(0), 50);
  }

  async onScroll() {
    const scrollEl = await this.content()?.getScrollElement();

    if (scrollEl!.scrollTop < 50 && !this.isLoadingOlder) {
      this.isLoadingOlder = true;

      const olderMessages = await this.messageService.getOlderMessages(this.chat()?.uid!);

      if (olderMessages.length) {
        const previousHeight = scrollEl!.scrollHeight;
        this.messagesSubject.next([...olderMessages, ...this.messagesSubject.getValue()]);

        setTimeout(() => {
          scrollEl!.scrollTop = scrollEl!.scrollHeight - previousHeight;
          this.isLoadingOlder = false;
        }, 50);
      } else {
        this.isLoadingOlder = false;
      }
    }
  }
}
