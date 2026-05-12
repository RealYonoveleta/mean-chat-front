import { Injectable, Type } from '@angular/core';
import { MessageContentType, MessageType } from '../../model/message';
import { ContentLocationComponent } from '../components/content/content-location/content-location.component';
import { ContentTextComponent } from '../components/content/content-text/content-text.component';

interface MessageTypeHandler {
  component: Type<any>;
  lastMessageFormatter: (content: MessageContentType) => string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageTypeHandlerRegistry {
  private registry = new Map<MessageType, MessageTypeHandler>([
    [
      MessageType.Text,
      {
        component: ContentTextComponent,
        lastMessageFormatter: (content) => content as string,
      },
    ],
    [
      MessageType.Location,
      {
        component: ContentLocationComponent,
        lastMessageFormatter: () => '📍 Location',
      },
    ],
  ]);

  getHandlerFor(type: MessageType): MessageTypeHandler | null {
    return this.registry.get(type) ?? null;
  }

  getComponentFor(type: MessageType): Type<any> | null {
    return this.getHandlerFor(type)?.component ?? null;
  }

  getLastMessageFormatterFor(type: MessageType): (content: MessageContentType) => string {
    const formatter = this.getHandlerFor(type)?.lastMessageFormatter;
    if (formatter) return formatter;
    return (content) => (typeof content === 'string' ? content : 'Message');
  }
}
