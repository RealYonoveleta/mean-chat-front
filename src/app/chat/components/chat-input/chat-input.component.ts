import { Component, inject, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MessageService } from '../../../message/services/message.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chat } from '../../../model/chat';
import { Message } from '../../../model/message';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Timestamp } from 'firebase/firestore';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  imports: [IonicModule, ReactiveFormsModule],
})
export class ChatInputComponent {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private currentUserService = inject(CurrentUserService);

  private user = toSignal(this.currentUserService.currentUser$);

  chat = input.required<Chat>();

  sendMessageForm = this.fb.nonNullable.group({
    message: ['', [Validators.required]],
  });

  async sendMessage() {
    if (!this.sendMessageForm.valid) return;

    const message: Message = {
      senderId: this.user()?.uid!,
      senderDisplayName: `${this.user()?.name} ${this.user()?.surname}`,
      content: this.sendMessageForm.value.message || '',
      createdAt: Timestamp.now(),
    };

    await this.messageService.createMessage(this.chat()?.uid!, message);

    this.sendMessageForm.reset();
  }
}
