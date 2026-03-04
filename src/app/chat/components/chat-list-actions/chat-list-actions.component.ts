import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-chat-list-actions',
  templateUrl: './chat-list-actions.component.html',
  styleUrls: ['./chat-list-actions.component.scss'],
  imports: [IonicModule, RouterLink],
})
export class ChatListActionsComponent {}
