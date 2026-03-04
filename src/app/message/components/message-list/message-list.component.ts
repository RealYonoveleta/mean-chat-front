import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { Message } from '../../../model/message';
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  imports: [MessageItemComponent],
})
export class MessageListComponent {
  messages = input<Message[]>();

  private currentUserService = inject(CurrentUserService);

  user = toSignal(this.currentUserService.currentUser$);

  isGrouped(index: number): boolean {
    const messages = this.messages()!;
    const current = messages[index];
    const next = messages[index + 1];

    if (!next) return false;

    return current.senderId === next.senderId;
  }

  isFirstOfGroup(index: number): boolean {
    const messages = this.messages()!;
    const current = messages[index];
    const previous = messages[index - 1];

    if (!previous) return true;

    return current.senderId !== previous.senderId;
  }
}
