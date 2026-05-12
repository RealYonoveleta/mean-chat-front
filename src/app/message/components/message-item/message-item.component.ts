import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Message } from '../../../model/message';
import { MessageTypeHandlerRegistry } from '../../services/message-type-handler-registry.service';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  imports: [NgComponentOutlet],
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

  private readonly registry = inject(MessageTypeHandlerRegistry);

  userDisplayName = computed(() => {
    const sender = this.message().sender;
    return sender.name ? `${sender.name} ${sender.surname}`.trim() : sender.username;
  });

  msgComponent = computed(() => this.registry.getComponentFor(this.message().type));
}

