import { Injectable, signal } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

@Injectable({
  providedIn: 'root'
})
export class RelativeTimeService {

  readonly tick = signal(0);

  constructor(private readonly i18nService: I18nService) {
    setInterval(() => this.tick.update(v => v + 1), 60000);
  }

  getRelativeTime(date: Date | string): string {
    this.tick();
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return this.i18nService.translate('relativeTime.justNow');
    if (minutes < 60) return this.i18nService.translate('relativeTime.minutesAgo', { count: minutes });
    if (hours < 24) return this.i18nService.translate('relativeTime.hoursAgo', { count: hours });
    if (days === 1) return this.i18nService.translate('relativeTime.yesterday');
    if (days < 7) return this.i18nService.translate('relativeTime.daysAgo', { count: days });
    if (weeks < 4) return this.i18nService.translate('relativeTime.weeksAgo', { count: weeks });
    if (months < 12) return this.i18nService.translate('relativeTime.monthsAgo', { count: months });
    return this.i18nService.translate('relativeTime.yearsAgo', { count: years });
  }
}
