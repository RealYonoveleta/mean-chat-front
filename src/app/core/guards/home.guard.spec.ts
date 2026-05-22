import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../auth/services/token.service';
import { vi } from 'vitest';

import { homeGuard } from './home.guard';

describe('homeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => homeGuard(...guardParameters));

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

  it('allows navigation when user is authenticated', () => {
    tokenServiceMock.isAuthenticated.mockReturnValue(true);

    expect(executeGuard({} as any, {} as any)).toBe(true);
  });

  it('redirects unauthenticated user to login', () => {
    const result = executeGuard({} as any, {} as any);

    expect(routerMock.parseUrl).toHaveBeenCalledWith('/auth/login');
    expect(result).toEqual({ redirectedTo: '/auth/login' });
  });
});
