import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LocationService } from '../../../core/location/services/location.service';
import { MessageService } from '../../../message/services/message.service';

import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent],
      providers: [
        {
          provide: MessageService,
          useValue: {
            sendMessage: vi.fn(),
            sendLocationMessage: vi.fn(),
          },
        },
        {
          provide: LocationService,
          useValue: {
            getLocation: vi.fn().mockResolvedValue({ latitude: 0, longitude: 0 }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
