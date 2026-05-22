import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentUserService } from '../../../core/user/current-user.service';

import { MessageListComponent } from './message-list.component';

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageListComponent],
      providers: [
        {
          provide: CurrentUserService,
          useValue: { getCurrentUser: () => ({ userId: 'u1' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('returns current user id from CurrentUserService', () => {
    expect(component.currentUserId).toBe('u1');
  });

  it('shouldInsertTimeLabel returns true for first message', () => {
    fixture.componentRef.setInput('messages', [
      {
        _id: 'm1',
        chat: 'c1',
        type: 'text',
        content: 'hello',
        sender: { _id: 'u1', username: 'u1', name: 'A', surname: 'A', email: 'a@a.com' },
        createdAt: '2026-01-01T10:00:00.000Z',
      } as any,
    ]);
    fixture.detectChanges();

    expect(component.shouldInsertTimeLabel(0)).toBe(true);
  });

  it('shouldInsertTimeLabel checks gap between messages', () => {
    fixture.componentRef.setInput('messages', [
      {
        _id: 'm1',
        chat: 'c1',
        type: 'text',
        content: 'hello',
        sender: { _id: 'u1', username: 'u1', name: 'A', surname: 'A', email: 'a@a.com' },
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        _id: 'm2',
        chat: 'c1',
        type: 'text',
        content: 'again',
        sender: { _id: 'u1', username: 'u1', name: 'A', surname: 'A', email: 'a@a.com' },
        createdAt: '2026-01-01T10:06:00.000Z',
      },
      {
        _id: 'm3',
        chat: 'c1',
        type: 'text',
        content: 'soon',
        sender: { _id: 'u1', username: 'u1', name: 'A', surname: 'A', email: 'a@a.com' },
        createdAt: '2026-01-01T10:07:00.000Z',
      },
    ] as any);
    fixture.detectChanges();

    expect(component.shouldInsertTimeLabel(1)).toBe(true);
    expect(component.shouldInsertTimeLabel(2)).toBe(false);
  });

  it('isGrouped and isFirstOfGroup compute sender grouping', () => {
    fixture.componentRef.setInput('messages', [
      {
        _id: 'm1',
        chat: 'c1',
        type: 'text',
        content: '1',
        sender: { _id: 'u1', username: 'u1', name: 'A', surname: 'A', email: 'a@a.com' },
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        _id: 'm2',
        chat: 'c1',
        type: 'text',
        content: '2',
        sender: { _id: 'u1', username: 'u1', name: 'A', surname: 'A', email: 'a@a.com' },
        createdAt: '2026-01-01T10:01:00.000Z',
      },
      {
        _id: 'm3',
        chat: 'c1',
        type: 'text',
        content: '3',
        sender: { _id: 'u2', username: 'u2', name: 'B', surname: 'B', email: 'b@b.com' },
        createdAt: '2026-01-01T10:02:00.000Z',
      },
    ] as any);
    fixture.detectChanges();

    expect(component.isGrouped(0)).toBe(true);
    expect(component.isGrouped(2)).toBe(false);

    expect(component.isFirstOfGroup(0)).toBe(true);
    expect(component.isFirstOfGroup(1)).toBe(false);
    expect(component.isFirstOfGroup(2)).toBe(true);
  });
});
