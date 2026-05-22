import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { UserService } from '../../../user/services/user.service';
import { ChatService } from '../../services/chat.service';

import { CreateChatComponent } from './create-chat.component';

describe('CreateChatComponent', () => {
  let component: CreateChatComponent;
  let fixture: ComponentFixture<CreateChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChatComponent],
      providers: [
        {
          provide: UserService,
          useValue: { getAllUsers: () => of([]) },
        },
        {
          provide: CurrentUserService,
          useValue: { getCurrentUser: () => ({ userId: 'u1' }) },
        },
        {
          provide: ChatService,
          useValue: { createChat: vi.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
