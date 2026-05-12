import { Component, inject, input } from '@angular/core';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { Message } from '../../../model/message';
import { MessageItemComponent } from '../message-item/message-item.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  imports: [MessageItemComponent, DatePipe],
})
export class MessageListComponent {
  messages = input<Message[]>();

  private currentUserService = inject(CurrentUserService);
  private readonly TIME_GAP = 5 * 60000;

  get currentUserId(): string | undefined {
    return this.currentUserService.getCurrentUser()?.userId;
  }

  shouldInsertTimeLabel(index: number): boolean {
    if (index === 0) return true;
    const messages = this.messages()!;
    const diff = new Date(messages[index].createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime();
    return diff > this.TIME_GAP;
  }

  isGrouped(index: number): boolean {
    const messages = this.messages()!;
    const current = messages[index];
    const next = messages[index + 1];

    if (!next) return false;

    return current.sender._id === next.sender._id;
  }

  isFirstOfGroup(index: number): boolean {
    const messages = this.messages()!;
    const current = messages[index];
    const previous = messages[index - 1];

    if (!previous) return true;

    return current.sender._id !== previous.sender._id;
  }
}

