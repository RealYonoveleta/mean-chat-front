import { TestBed } from '@angular/core/testing';
import { TokenPayload, TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  const createToken = (payload: Partial<TokenPayload>) => {
    const now = Math.floor(Date.now() / 1000);
    const completePayload: TokenPayload = {
      userId: payload.userId ?? 'u1',
      username: payload.username ?? 'user',
      name: payload.name ?? 'Test',
      surname: payload.surname ?? 'User',
      email: payload.email ?? 'test@example.com',
      exp: payload.exp ?? now + 60,
      iat: payload.iat ?? now,
    };

    return `header.${btoa(JSON.stringify(completePayload))}.signature`;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('sets and gets both tokens', () => {
    service.setTokens('access-token', 'refresh-token');

    expect(service.getToken()).toBe('access-token');
    expect(service.getRefreshToken()).toBe('refresh-token');
  });

  it('sets token and refresh token independently', () => {
    service.setToken('access-only');
    service.setRefreshToken('refresh-only');

    expect(service.getToken()).toBe('access-only');
    expect(service.getRefreshToken()).toBe('refresh-only');
  });

  it('clears tokens with clearTokens and removeToken', () => {
    service.setTokens('access-token', 'refresh-token');
    service.clearTokens();

    expect(service.getToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();

    service.setTokens('access-token', 'refresh-token');
    service.removeToken();

    expect(service.getToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });

  it('returns decoded payload for a valid token', () => {
    const token = createToken({ username: 'alice' });
    service.setToken(token);

    expect(service.getPayload()?.username).toBe('alice');
  });

  it('returns null payload for malformed token', () => {
    service.setToken('bad.token.value');

    expect(service.getPayload()).toBeNull();
  });

  it('isAuthenticated returns false when token is missing', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated returns false when token is expired', () => {
    const token = createToken({ exp: Math.floor(Date.now() / 1000) - 10 });
    service.setToken(token);

    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated returns true for non-expired token', () => {
    const token = createToken({ exp: Math.floor(Date.now() / 1000) + 300 });
    service.setToken(token);

    expect(service.isAuthenticated()).toBe(true);
  });
});
