import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { environment } from '../../../environments/environment';

const { ioMock } = vi.hoisted(() => ({
  ioMock: vi.fn(),
}));

vi.mock('socket.io-client', () => ({
  io: ioMock,
}));

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;
  let fakeSocket: any;

  beforeEach(() => {
    fakeSocket = {
      connected: false,
      auth: {},
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      disconnect: vi.fn(),
    };
    ioMock.mockReset();
    ioMock.mockReturnValue(fakeSocket);

    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('connect creates socket with token auth', () => {
    service.connect('jwt-token');

    expect(ioMock).toHaveBeenCalledWith(environment.wsUrl, {
      auth: { token: 'jwt-token' },
      autoConnect: true,
    });
  });

  it('connect does nothing when socket is already connected', () => {
    (service as any).socket = { connected: true, disconnect: vi.fn() };

    service.connect('jwt-token');

    expect(ioMock).not.toHaveBeenCalled();
  });

  it('disconnect disconnects and clears socket reference', () => {
    (service as any).socket = fakeSocket;

    service.disconnect();

    expect(fakeSocket.disconnect).toHaveBeenCalled();
    expect((service as any).socket).toBeNull();
  });

  it('updateToken updates socket auth when socket exists', () => {
    (service as any).socket = fakeSocket;

    service.updateToken('new-token');

    expect(fakeSocket.auth).toEqual({ token: 'new-token' });
  });

  it('emit and off delegate to socket', () => {
    (service as any).socket = fakeSocket;

    service.emit('evt', { ok: true });
    service.off('evt');

    expect(fakeSocket.emit).toHaveBeenCalledWith('evt', { ok: true });
    expect(fakeSocket.off).toHaveBeenCalledWith('evt');
  });

  it('on wires observable and cleans up handler on unsubscribe', () => {
    (service as any).socket = fakeSocket;

    let capturedHandler: ((data: string) => void) | undefined;
    fakeSocket.on.mockImplementation((_event: string, handler: (data: string) => void) => {
      capturedHandler = handler;
    });

    const listener = vi.fn();
    const sub = service.on<string>('chat-message').subscribe(listener);

    capturedHandler?.('hello');

    expect(fakeSocket.on).toHaveBeenCalledWith('chat-message', expect.any(Function));
    expect(listener).toHaveBeenCalledWith('hello');

    sub.unsubscribe();

    expect(fakeSocket.off).toHaveBeenCalledWith('chat-message', expect.any(Function));
  });

  it('ngOnDestroy disconnects socket', () => {
    const disconnectSpy = vi.spyOn(service, 'disconnect');

    service.ngOnDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
  });
});
