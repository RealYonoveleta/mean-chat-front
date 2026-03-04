import { Routes } from '@angular/router';
import { ChatHomeComponent } from './chat/components/chat-home/chat-home.component';
import { authGuard } from './core/guards/auth.guard';
import { homeGuard } from './core/guards/home.guard';
import authRoutes from './auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: ChatHomeComponent,
    canActivate: [homeGuard],
    loadChildren: () => import('./chat/chat.routes')
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
