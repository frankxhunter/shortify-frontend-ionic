import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { AnalyticsRange } from 'src/app/Dtos/interfaces';

@Component({
  selector: 'app-range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.scss'],
  standalone: true,
  imports: [IonSegment, IonSegmentButton],
})
export class RangeSelectorComponent {
  @Input({ required: true }) selectedRange: AnalyticsRange = '7d';
  @Output() rangeChange = new EventEmitter<AnalyticsRange>();

  ranges: { value: AnalyticsRange; label: string }[] = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: 'all', label: 'ALL' },
  ];

  onRangeChanged(event: CustomEvent) {
    this.rangeChange.emit(event.detail.value as AnalyticsRange);
  }
}
