import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ToastController } from '@ionic/angular';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  const toast = {
    present: vi.fn().mockResolvedValue(undefined),
  };

  const toastControllerMock = {
    create: vi.fn().mockResolvedValue(toast),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('showToast creates and presents a success toast by default', async () => {
    await service.showToast('Saved');

    expect(toastControllerMock.create).toHaveBeenCalledWith({
      message: 'Saved',
      duration: 5000,
      position: 'top',
      color: 'success',
    });
    expect(toast.present).toHaveBeenCalled();
  });

  it('showToast uses danger color when isError is true', async () => {
    await service.showToast('Failed', true);

    expect(toastControllerMock.create).toHaveBeenCalledWith({
      message: 'Failed',
      duration: 5000,
      position: 'top',
      color: 'danger',
    });
  });
});
