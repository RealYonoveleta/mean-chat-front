import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { vi } from 'vitest';
import { ChatService } from '../../services/chat.service';

import { ChatListComponent } from './chat-list.component';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListComponent],
      providers: [
        provideRouter([]),
        {
          provide: ChatService,
          useValue: {
            getChats: () => of([]),
            listenForNewChats: () => EMPTY,
            listenForChatUpdates: () => EMPTY,
            setActiveChat: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
