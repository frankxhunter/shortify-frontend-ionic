import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonChip, IonIcon } from '@ionic/angular/standalone';
import { ClickHistoryEntry } from 'src/app/Dtos/interfaces';
import { RelativeTimePipe } from 'src/app/pipes/relative-time-pipe-pipe';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-click-history-panel',
  templateUrl: './click-history-panel.component.html',
  styleUrls: ['./click-history-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, IonChip, IonIcon, RelativeTimePipe, TranslatePipe],
})
export class ClickHistoryPanelComponent {
  @Input({ required: true }) entries: ClickHistoryEntry[] = [];
  @Input() mockMode = false;
  @Input() hasActiveFilters = false;

  trackById(_: number, entry: ClickHistoryEntry): string {
    return entry.id;
  }
}
