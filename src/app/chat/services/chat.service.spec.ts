import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../core/socket/socket.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Chat } from '../../model/chat';

import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  const socketServiceMock = {
    on: vi.fn(),
  };

  const notificationServiceMock = {
    showToast: vi.fn(),
  };

  const sampleChat: Chat = {
    _id: 'chat-1',
    name: 'General',
    isGroup: true,
    members: [],
    lastMessage: 'hello',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        ChatService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SocketService, useValue: socketServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setActiveChat updates currentChat and stream', () => {
    const emitted: Array<Chat | null> = [];
    const sub = service.chat$.subscribe((value) => emitted.push(value));

    service.setActiveChat(sampleChat);

    expect(service.currentChat).toEqual(sampleChat);
    expect(emitted[emitted.length - 1]).toEqual(sampleChat);
    sub.unsubscribe();
  });

  it('getChats requests chat list', async () => {
    const promise = service.getChats().toPromise();

    const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
    expect(req.request.method).toBe('GET');
    req.flush([sampleChat]);

    await expect(promise).resolves.toEqual([sampleChat]);
  });

  it('getChatById requests a single chat', async () => {
    const promise = service.getChatById('chat-1').toPromise();

    const req = httpMock.expectOne(`${environment.apiUrl}/chat/chat-1`);
    expect(req.request.method).toBe('GET');
    req.flush(sampleChat);

    await expect(promise).resolves.toEqual(sampleChat);
  });

  it('createChat posts data and shows success toast', async () => {
    const promise = service.createChat(['u2', 'u3'], 'Project', true);

    const req = httpMock.expectOne(`${environment.apiUrl}/chat`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ members: ['u2', 'u3'], name: 'Project', isGroup: true });
    req.flush(sampleChat);

    await promise;
    expect(notificationServiceMock.showToast).toHaveBeenCalledWith('Chat "Project" created successfully');
  });

  it('listenForNewChats delegates to socket service', () => {
    const stream = of(sampleChat);
    socketServiceMock.on.mockReturnValueOnce(stream);

    expect(service.listenForNewChats()).toBe(stream);
    expect(socketServiceMock.on).toHaveBeenCalledWith('chat-created');
  });

  it('listenForChatUpdates delegates to socket service', () => {
    const update = { _id: 'chat-1', lastMessage: 'updated', updatedAt: new Date() };
    const stream = of(update);
    socketServiceMock.on.mockReturnValueOnce(stream);

    expect(service.listenForChatUpdates()).toBe(stream);
    expect(socketServiceMock.on).toHaveBeenCalledWith('chat-updated');
  });
});
