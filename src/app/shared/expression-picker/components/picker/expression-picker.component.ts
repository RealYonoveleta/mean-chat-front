import { NgComponentOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabRegistry, TabType } from '../../services/tab-registry.service';

@Component({
  selector: 'app-expression-picker',
  templateUrl: './expression-picker.component.html',
  styleUrls: ['./expression-picker.component.scss'],
  imports: [IonicModule, NgComponentOutlet],
})
export class ExpressionPickerComponent {
  private readonly tabRegistry = inject(TabRegistry);

  TabType = TabType;

  activeTab = signal<TabType>(TabType.Emoji);

  setTab(type: TabType): void {
    this.activeTab.set(type);
  }

  getTab() {
    return this.tabRegistry.getComponentFor(this.activeTab());
  }
}
