import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AccountPanelComponent } from '../account-panel/account-panel.component';
import { ChatListComponent } from '../chat-list/chat-list.component';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.scss'],
  imports: [ChatListComponent, AccountPanelComponent, RouterOutlet, IonicModule],
})
export class ChatHomeComponent {}
