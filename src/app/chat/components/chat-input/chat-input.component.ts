import { Component, effect, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import { Location } from '../../../core/location/models/location';
import { LocationService } from '../../../core/location/services/location.service';
import { MessageService } from '../../../message/services/message.service';
import { Chat } from '../../../model/chat';
import { ExpressionPickerComponent } from '../../../shared/expression-picker/components/picker/expression-picker.component';
import { ChatInputService, InsertOptions } from '../../services/chat-input.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, ExpressionPickerComponent],
  host: {
    '(keydown.enter)': 'sendMessage(); $event.preventDefault()',
  },
})
export class ChatInputComponent {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private locationService = inject(LocationService);
  private chatInputService = inject(ChatInputService);

  chat = input.required<Chat>();

  private chatInput = viewChild.required<IonInput>('input');

  sendMessageForm = this.fb.nonNullable.group({
    message: ['', [Validators.required]],
  });

  expressionPickerOpened = signal<boolean>(false);
  pickerHeight = signal<number>(320);

  private readonly MIN_PICKER_HEIGHT = 150;
  private readonly MAX_PICKER_HEIGHT = 600;

  constructor() {
    effect(async () => {
      const toInsert = this.chatInputService.toInsert();
      if (!toInsert) return;
      await this.insert(toInsert);
      this.chatInputService.clearInsert();
    });
  }

  private async insert(options: InsertOptions): Promise<void> {
    const control = this.sendMessageForm.controls['message'];
    const current = control.value ?? '';
    const { toInsert, atCursor } = options;

    if (!atCursor) {
      control.setValue(current + toInsert);
      return;
    }

    const inputElement = await this.chatInput().getInputElement();
    const fallbackPos = current.length;
    const start = inputElement.selectionStart ?? fallbackPos;
    const end = inputElement.selectionEnd ?? fallbackPos;
    const newValue = current.slice(0, start) + toInsert + current.slice(end);
    control.setValue(newValue);

    const newCursorPos = start + toInsert.length;
    setTimeout(() => {
      inputElement.focus();
      inputElement.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  toggleExpressionPicker(): void {
    this.expressionPickerOpened.set(!this.expressionPickerOpened());
  }

  onPickerDragStart(e: PointerEvent): void {
    const startY = e.clientY;
    const startHeight = this.pickerHeight();

    const onMove = (ev: PointerEvent) => {
      const delta = startY - ev.clientY;
      const clamped = Math.min(this.MAX_PICKER_HEIGHT, Math.max(this.MIN_PICKER_HEIGHT, startHeight + delta));
      this.pickerHeight.set(clamped);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    e.preventDefault();
  }

  sendMessage(): void {
    if (!this.sendMessageForm.valid) return;
    const content = this.sendMessageForm.getRawValue().message;
    this.messageService.sendMessage(content);
    this.sendMessageForm.reset();
  }

  async sendLocation(): Promise<void> {
    try {
      const location: Location = await this.locationService.getLocation();
      this.messageService.sendLocationMessage(location);
    } catch (err) {
      console.error('Could not get location:', err);
    }
  }
}

