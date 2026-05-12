import { Component, computed, input } from '@angular/core';
import { Message } from '../../../model/message';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  host: {
    '[class]': "isSelf() ? 'self' : 'other'",
    '[class.grouped]': 'isGrouped()',
    '[class.first]': 'isFirstOfGroup()',
  },
})
export class MessageItemComponent {
  message = input.required<Message>();
  isFirstOfGroup = input<boolean>();
  isGrouped = input<boolean>();
  isSelf = input<boolean>();

  userDisplayName = computed(() => {
    const sender = this.message().sender;
    return sender.name ? `${sender.name} ${sender.surname}`.trim() : sender.username;
  });
}

