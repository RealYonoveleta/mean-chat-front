import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentUserService } from '../../../core/user/current-user.service';

import { ChatWidgetComponent } from './chat-widget.component';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWidgetComponent],
      providers: [
        {
          provide: CurrentUserService,
          useValue: { getCurrentUser: () => ({ userId: 'u1' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
