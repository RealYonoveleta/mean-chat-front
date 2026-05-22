import { TestBed } from '@angular/core/testing';
import { ChatInputService } from './chat-input.service';

describe('ChatInputService', () => {
  let service: ChatInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatInputService);
  });

  it('requestInsert string sets default cursor behavior', () => {
    service.requestInsert('😀');

    expect(service.toInsert()).toEqual({ toInsert: '😀', atCursor: true });
  });

  it('requestInsert object keeps provided options', () => {
    service.requestInsert({ toInsert: 'XYZ', atCursor: false });

    expect(service.toInsert()).toEqual({ toInsert: 'XYZ', atCursor: false });
  });

  it('clearInsert removes pending insert', () => {
    service.requestInsert('hello');
    service.clearInsert();

    expect(service.toInsert()).toBeNull();
  });
});
