import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MessageService } from '../../../message/services/message.service';
import { Chat } from '../../../model/chat';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  imports: [IonicModule, ReactiveFormsModule],
})
export class ChatInputComponent {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  chat = input.required<Chat>();

  sendMessageForm = this.fb.nonNullable.group({
    message: ['', [Validators.required]],
  });

  sendMessage(): void {
    if (!this.sendMessageForm.valid) return;

    const content = this.sendMessageForm.getRawValue().message;
    this.messageService.sendMessage(content);
    this.sendMessageForm.reset();
  }
}

