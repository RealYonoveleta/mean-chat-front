import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { vi } from 'vitest';
import { SocketService } from '../../../core/socket/socket.service';
import { MessageService } from '../../../message/services/message.service';
import { ChatService } from '../../services/chat.service';

import { ChatViewComponent } from './chat-view.component';

describe('ChatViewComponent', () => {
  let component: ChatViewComponent;
  let fixture: ComponentFixture<ChatViewComponent>;

  beforeEach(async () => {
    const mockChat = { _id: 'chat-1', members: [] } as any;

    await TestBed.configureTestingModule({
      imports: [ChatViewComponent],
      providers: [
        {
          provide: ChatService,
          useValue: {
            currentChat: mockChat,
            chat$: of(mockChat),
            getChatById: () => of(mockChat),
            setActiveChat: vi.fn(),
          },
        },
        {
          provide: MessageService,
          useValue: {
            getMessageHistory: () => of([]),
            listenForMessages: () => EMPTY,
          },
        },
        {
          provide: SocketService,
          useValue: { emit: vi.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatViewComponent);
    component = fixture.componentInstance;
    vi.spyOn(component as any, 'scrollToBottom').mockImplementation(() => undefined);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
