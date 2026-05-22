import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentUserService } from '../../../core/user/current-user.service';

import { ChatHeaderComponent } from './chat-header.component';

describe('ChatHeaderComponent', () => {
  let component: ChatHeaderComponent;
  let fixture: ComponentFixture<ChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatHeaderComponent],
      providers: [
        {
          provide: CurrentUserService,
          useValue: { getCurrentUser: () => ({ userId: 'u1' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
