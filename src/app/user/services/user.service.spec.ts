import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllUsers requests users list', async () => {
    const promise = service.getAllUsers().toPromise();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/users`);
    expect(req.request.method).toBe('GET');
    req.flush([{ username: 'alice' }]);

    await expect(promise).resolves.toEqual([{ username: 'alice' }]);
  });
});
