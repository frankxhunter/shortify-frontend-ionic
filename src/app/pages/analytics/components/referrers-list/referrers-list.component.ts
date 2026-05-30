import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { ReferrerStat } from 'src/app/Dtos/interfaces';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-referrers-list',
  templateUrl: './referrers-list.component.html',
  styleUrls: ['./referrers-list.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, IonCard, IonCardTitle, IonIcon],
})
export class ReferrersListComponent {
  @Input({ required: true }) referrers: ReferrerStat[] = [];

  getReferrerLabel(referrer: string): string {
    if (!referrer || referrer === '') {
      return 'analytics.direct' as any;
    }
    try {
      const hostname = new URL(referrer).hostname;
      return hostname.replace('www.', '');
    } catch {
      return referrer;
    }
  }
}
