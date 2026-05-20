import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { defineCustomElements } from '@ionic/core/loader';

defineCustomElements(window);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
