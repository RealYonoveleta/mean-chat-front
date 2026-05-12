import { Component, input } from '@angular/core';

@Component({
  selector: 'app-content-text',
  templateUrl: './content-text.component.html',
  styleUrls: ['./content-text.component.scss'],
})
export class ContentTextComponent {
  content = input.required<string>();
}
