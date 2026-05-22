import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CurrentUserService } from '../../../core/user/current-user.service';

import { AccountPanelComponent } from './account-panel.component';

describe('AccountPanelComponent', () => {
  let component: AccountPanelComponent;
  let fixture: ComponentFixture<AccountPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPanelComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { logout: vi.fn() },
        },
        {
          provide: CurrentUserService,
          useValue: {
            getCurrentUser: () => ({ userId: 'u1', username: 'user', name: 'Test', surname: 'User' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
