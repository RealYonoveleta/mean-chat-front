import { Component, DestroyRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IonContent, IonicModule } from '@ionic/angular';
import { MessageListComponent } from '../../../message/components/message-list/message-list.component';
import { ChatService } from '../../services/chat.service';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { MessageService } from '../../../message/services/message.service';
import { Message } from '../../../model/message';
import { SocketService } from '../../../core/socket/socket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
  imports: [ChatHeaderComponent, MessageListComponent, IonicModule, ChatInputComponent],
})
export class ChatViewComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private messageService = inject(MessageService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  chat = toSignal(this.chatService.chat$, { initialValue: null });

  content = viewChild<IonContent>('content');

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages = toSignal(this.messagesSubject.asObservable(), { initialValue: [] });

  private isLoadingOlder = false;
  private currentPage = 1;

  ngOnInit(): void {
    // On page refresh the service state is empty — hydrate from the route param
    if (!this.chatService.currentChat) {
      const chatId = this.route.snapshot.paramMap.get('chatId');
      if (chatId) {
        this.chatService.getChatById(chatId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((chat) => this.chatService.setActiveChat(chat));
      }
    }

    // Load message history when active chat changes, join socket room
    this.chatService.chat$
      .pipe(
        tap((chat) => {
          if (chat) {
            this.socketService.emit('join-chat', { chatId: chat._id });
            this.currentPage = 1;
          }
        }),
        switchMap((chat) =>
          chat ? this.messageService.getMessageHistory(chat._id!, 1) : []
        ),
        tap(() => this.scrollToBottom()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((messages) => this.messagesSubject.next([...messages].reverse()));

    // Listen for incoming real-time messages
    this.messageService.listenForMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        this.messagesSubject.next([...this.messagesSubject.getValue(), message]);
        this.scrollToBottom();
      });
  }

  ngOnDestroy(): void {
    this.socketService.emit('leave-chat');
  }

  private scrollToBottom(): void {
    setTimeout(() => this.content()?.scrollToBottom(0), 50);
  }

  async onScroll(): Promise<void> {
    const scrollEl = await this.content()?.getScrollElement();
    if (!scrollEl || scrollEl.scrollTop > 50 || this.isLoadingOlder) return;

    const chatId = this.chat()?._id;
    if (!chatId) return;

    this.isLoadingOlder = true;
    this.currentPage++;

    this.messageService
      .getMessageHistory(chatId, this.currentPage)
      .subscribe((olderMessages) => {
        if (olderMessages.length) {
          const previousHeight = scrollEl.scrollHeight;
          this.messagesSubject.next([...[...olderMessages].reverse(), ...this.messagesSubject.getValue()]);
          setTimeout(() => {
            scrollEl.scrollTop = scrollEl.scrollHeight - previousHeight;
            this.isLoadingOlder = false;
          }, 50);
        } else {
          this.isLoadingOlder = false;
        }
      });
  }
}

