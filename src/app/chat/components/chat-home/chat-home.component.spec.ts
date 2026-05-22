import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { ChatService } from '../../services/chat.service';

import { ChatHomeComponent } from './chat-home.component';

describe('ChatHomeComponent', () => {
  let component: ChatHomeComponent;
  let fixture: ComponentFixture<ChatHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { logout: vi.fn() },
        },
        {
          provide: CurrentUserService,
          useValue: {
            getCurrentUser: () => ({ userId: 'u1', username: 'user', name: 'Test', surname: 'User' }),
          },
        },
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

    fixture = TestBed.createComponent(ChatHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
