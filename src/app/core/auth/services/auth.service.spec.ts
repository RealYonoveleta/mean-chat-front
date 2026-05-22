import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../../socket/socket.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const tokenServiceMock = {
    isAuthenticated: vi.fn<() => boolean>(() => false),
    setTokens: vi.fn<(token: string, refreshToken: string) => void>(),
    getRefreshToken: vi.fn<() => string | null>(() => null),
    clearTokens: vi.fn<() => void>(),
  };

  const socketServiceMock = {
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tokenServiceMock.isAuthenticated.mockReturnValue(false);
    tokenServiceMock.getRefreshToken.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: SocketService, useValue: socketServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register posts the expected payload', async () => {
    const promise = service.register('user', 'password123', 'Name', 'Surname', 'u@example.com');

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'user',
      password: 'password123',
      name: 'Name',
      surname: 'Surname',
      email: 'u@example.com',
    });

    req.flush({});
    await promise;
  });

  it('login stores tokens, marks authenticated and connects socket', async () => {
    const authStates: boolean[] = [];
    const sub = service.isAuthenticated$.subscribe((value) => authStates.push(value));

    const promise = service.login('user', 'password123');

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'access', refreshToken: 'refresh' });

    await promise;

    expect(tokenServiceMock.setTokens).toHaveBeenCalledWith('access', 'refresh');
    expect(socketServiceMock.connect).toHaveBeenCalledWith('access');
    expect(authStates[authStates.length - 1]).toBe(true);
    sub.unsubscribe();
  });

  it('logout with refresh token posts logout and clears auth state', () => {
    tokenServiceMock.getRefreshToken.mockReturnValue('rt-1');
    const authStates: boolean[] = [];
    const sub = service.isAuthenticated$.subscribe((value) => authStates.push(value));

    service.logout();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'rt-1' });
    req.flush({});

    expect(tokenServiceMock.clearTokens).toHaveBeenCalled();
    expect(socketServiceMock.disconnect).toHaveBeenCalled();
    expect(authStates[authStates.length - 1]).toBe(false);
    sub.unsubscribe();
  });

  it('logout without refresh token skips request but still clears state', () => {
    tokenServiceMock.getRefreshToken.mockReturnValue(null);

    service.logout();

    httpMock.expectNone(`${environment.apiUrl}/auth/logout`);
    expect(tokenServiceMock.clearTokens).toHaveBeenCalled();
    expect(socketServiceMock.disconnect).toHaveBeenCalled();
  });

  it('logout tolerates logout request failure', () => {
    tokenServiceMock.getRefreshToken.mockReturnValue('rt-1');

    service.logout();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(tokenServiceMock.clearTokens).toHaveBeenCalled();
    expect(socketServiceMock.disconnect).toHaveBeenCalled();
  });
});
