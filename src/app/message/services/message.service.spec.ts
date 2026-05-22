import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../core/socket/socket.service';
import { MessageType } from '../../model/message';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  const socketServiceMock = {
    on: vi.fn(),
    emit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SocketService, useValue: socketServiceMock },
      ],
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMessageHistory requests paginated history', async () => {
    const promise = service.getMessageHistory('chat-1', 2, 10).toPromise();

    const req = httpMock.expectOne(`${environment.apiUrl}/chat/chat-1/messages?page=2&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush([{ _id: 'm1' }]);

    await expect(promise).resolves.toEqual([{ _id: 'm1' }]);
  });

  it('listenForMessages delegates to socket listener', () => {
    const stream = of({ _id: 'm1' } as any);
    socketServiceMock.on.mockReturnValueOnce(stream);

    expect(service.listenForMessages()).toBe(stream);
    expect(socketServiceMock.on).toHaveBeenCalledWith('chat-message');
  });

  it('sendMessage emits text chat-message event', () => {
    service.sendMessage('hello');

    expect(socketServiceMock.emit).toHaveBeenCalledWith('chat-message', {
      content: 'hello',
      type: MessageType.Text,
    });
  });

  it('sendLocationMessage emits location chat-message event', () => {
    service.sendLocationMessage({ latitude: 10, longitude: 20 });

    expect(socketServiceMock.emit).toHaveBeenCalledWith('chat-message', {
      content: { latitude: 10, longitude: 20 },
      type: MessageType.Location,
    });
  });
});
