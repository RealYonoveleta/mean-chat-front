import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageTypeHandlerRegistry } from '../../services/message-type-handler-registry.service';

import { MessageItemComponent } from './message-item.component';

describe('MessageItemComponent', () => {
  let component: MessageItemComponent;
  let fixture: ComponentFixture<MessageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageItemComponent],
      providers: [
        {
          provide: MessageTypeHandlerRegistry,
          useValue: { getComponentFor: () => null },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', {
      _id: 'm1',
      chat: 'chat-1',
      type: 'text',
      content: 'hello',
      sender: { _id: 'u1', username: 'user', name: 'Test', surname: 'User' },
      createdAt: new Date().toISOString(),
    } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
