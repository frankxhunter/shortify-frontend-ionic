import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { UrlAnalytics } from 'src/app/Dtos/interfaces';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe],
})
export class SummaryCardsComponent {
  @Input({ required: true }) analytics!: UrlAnalytics;

  formatNumber(num: number): string {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  }

  formatLastClicked(date: string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
