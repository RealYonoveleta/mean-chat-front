import { TestBed } from '@angular/core/testing';
import { MessageType } from '../../model/message';
import { ContentLocationComponent } from '../components/content/content-location/content-location.component';
import { ContentTextComponent } from '../components/content/content-text/content-text.component';
import { MessageTypeHandlerRegistry } from './message-type-handler-registry.service';

describe('MessageTypeHandlerRegistry', () => {
  let service: MessageTypeHandlerRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageTypeHandlerRegistry);
  });

  it('returns text handler data for text messages', () => {
    const handler = service.getHandlerFor(MessageType.Text);

    expect(handler).not.toBeNull();
    expect(handler?.component).toBe(ContentTextComponent);
    expect(handler?.lastMessageFormatter('hello')).toBe('hello');
  });

  it('returns location handler data for location messages', () => {
    const handler = service.getHandlerFor(MessageType.Location);

    expect(handler).not.toBeNull();
    expect(handler?.component).toBe(ContentLocationComponent);
    expect(handler?.lastMessageFormatter({ latitude: 1, longitude: 2 })).toBe('📍 Location');
  });

  it('returns null handler/component for unsupported type', () => {
    const unknown = 'unknown' as MessageType;

    expect(service.getHandlerFor(unknown)).toBeNull();
    expect(service.getComponentFor(unknown)).toBeNull();
  });

  it('fallback formatter returns string for text and generic label for non-text', () => {
    const formatter = service.getLastMessageFormatterFor('unknown' as MessageType);

    expect(formatter('raw text')).toBe('raw text');
    expect(formatter({ latitude: 1, longitude: 2 })).toBe('Message');
  });
});
