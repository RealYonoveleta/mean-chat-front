import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CurrentUserService } from '../../../core/user/current-user.service';
import { arrayMinLength } from '../../../core/validators/array-min-length';
import { User } from '../../../model/user';
import { UserService } from '../../../user/services/user.service';
import { ChatService } from '../../services/chat.service';

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
  private chatService = inject(ChatService);

  private currentUser = this.currentUserService.getCurrentUser();

  users = toSignal(this.userService.getAllUsers(), { initialValue: [] });

  createChatForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    participants: this.fb.nonNullable.control<User[]>([], [arrayMinLength(1)]),
  });

  get formControls() {
    return this.createChatForm.controls;
  }

  displayName(user: User): string {
    return `${user.name} ${user.surname} - ${user.email}`;
  }

  toggleParticipant(user: User): void {
    const control = this.createChatForm.get('participants');
    const current: User[] = control?.value || [];
    const isAlreadySelected = current.some((u) => u._id === user._id);

    if (isAlreadySelected) {
      control?.setValue(current.filter((u) => u._id !== user._id));
    } else {
      control?.setValue([...current, user]);
    }

    control?.markAsTouched();
  }

  isSelected(user: User): boolean {
    return (this.createChatForm.value.participants ?? []).some((u) => u._id === user._id);
  }

  async onSubmit(): Promise<void> {
    if (!this.createChatForm.valid) return;

    const value = this.createChatForm.getRawValue();
    const participantIds = value.participants.map((u) => u._id!);
    const isGroup = value.participants.length > 1;

    await this.chatService.createChat(participantIds, value.name, isGroup);
    this.createChatForm.reset();
  }
}
