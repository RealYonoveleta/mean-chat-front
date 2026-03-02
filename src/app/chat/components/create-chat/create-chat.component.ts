import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { map } from 'rxjs';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { arrayMinLength } from '../../../core/validators/array-min-length';
import { User } from '../../../model/user';
import { UserService } from '../../../user/services/user.service';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../../model/chat';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.scss'],
  imports: [ReactiveFormsModule, IonicModule],
})
export class CreateChatComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private currentUserService = inject(CurrentUserService);
  private charService = inject(ChatService);

  private user = toSignal(this.currentUserService.currentUser$);

  users = toSignal(
    this.userService
      .getAllUsers()
      .pipe(map((users) => users.filter((user) => user.uid !== this.user()?.uid))),
    { initialValue: [] },
  );

  createChatForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    participants: this.fb.nonNullable.control<User[]>([], [arrayMinLength(1)]),
  });

  get formControls() {
    return this.createChatForm.controls;
  }

  displayName(user: User) {
    return `${user.name} ${user.surname} - ${user.email}`;
  }

  toggleParticipant(user: User) {
    const control = this.createChatForm.get('participants');
    const current = control?.value || [];

    if (current.includes(user)) {
      control?.setValue(current.filter((u) => u.uid !== user.uid));
    } else {
      control?.setValue([...current, user]);
    }

    control?.markAsTouched();
  }

  isSelected(user: User) {
    return this.createChatForm.value.participants?.includes(user);
  }

  async onSubmit() {
    if (!this.createChatForm.valid) return;

    const value = this.createChatForm.value;
    const participants = [this.user(), ...value.participants!];

    const chat: Chat = {
      title: value.title!,
      participants: participants.map((user) => user?.uid!),
      lastMessage: '',
      updatedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    };

    this.charService.createChat(chat);
  }
}
