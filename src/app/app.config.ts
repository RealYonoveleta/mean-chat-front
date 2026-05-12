import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { addIcons } from 'ionicons';
import { logOutOutline, addCircleOutline, send, happy, location } from 'ionicons/icons';

addIcons({
  logOutOutline,
  addCircleOutline,
  send,
  happy,
  location,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIonicAngular({}),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};

