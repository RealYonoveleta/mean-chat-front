import { Routes } from '@angular/router';
import { ChatViewComponent } from './components/chat-view/chat-view.component';
import { CreateChatComponent } from './components/create-chat/create-chat.component';

const chatRoutes: Routes = [
  {
    path: 'create-chat',
    component: CreateChatComponent,
  },
  {
    path: ':chatId',
    component: ChatViewComponent,
  },
  {
    path: '',
    redirectTo: 'create-chat',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'create-chat',
  },
];

export default chatRoutes;
