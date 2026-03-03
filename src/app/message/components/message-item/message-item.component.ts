import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Message } from '../../../model/message';
import { User } from '../../../model/user';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss'],
  host: {
    '[class]': "isSelf() ? 'self' : 'other'",
    '[class.grouped]': 'isGrouped()',
    '[class.first]': 'isFirstOfGroup()',
  },
})
export class MessageItemComponent implements OnInit {
  message = input.required<Message>();
  isFirstOfGroup = input<boolean>();
  isGrouped = input<boolean>();
  isSelf = input<boolean>();

  private userService = inject(UserService);

  user = signal<User | null>(null);
  userDisplayName = computed(() => `${this.user()?.name} ${this.user()?.surname}`);

  ngOnInit() {
    this.userService.getUser(this.message().senderId).subscribe((user) => this.user.set(user));
  }
}
