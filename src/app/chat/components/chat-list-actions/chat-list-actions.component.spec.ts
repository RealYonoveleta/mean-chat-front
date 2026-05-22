import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ChatListActionsComponent } from './chat-list-actions.component';

describe('ChatListActionsComponent', () => {
  let component: ChatListActionsComponent;
  let fixture: ComponentFixture<ChatListActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListActionsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatListActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
