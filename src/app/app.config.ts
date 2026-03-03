import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logOutOutline, addCircleOutline, send } from 'ionicons/icons';

addIcons({
  logOutOutline,
  addCircleOutline,
  send,
});

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideIonicAngular({})],
};
