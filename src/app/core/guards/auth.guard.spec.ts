import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../auth/services/token.service';
import { vi } from 'vitest';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const routerMock = {
    parseUrl: vi.fn((url: string) => ({ redirectedTo: url })),
  };

  const tokenServiceMock = {
    isAuthenticated: vi.fn(() => false),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tokenServiceMock.isAuthenticated.mockReturnValue(false);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    });
  });

  it('returns true when user is not authenticated', () => {
    expect(executeGuard({} as any, {} as any)).toBe(true);
    expect(routerMock.parseUrl).not.toHaveBeenCalled();
  });

  it('redirects authenticated user to home', () => {
    tokenServiceMock.isAuthenticated.mockReturnValue(true);

    const result = executeGuard({} as any, {} as any);

    expect(routerMock.parseUrl).toHaveBeenCalledWith('/home');
    expect(result).toEqual({ redirectedTo: '/home' });
  });
});
