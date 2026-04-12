import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RelativeTimeService {

  readonly tick = signal(0);

  constructor() {
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

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks}w ago`;
    if (months < 12) return `${months} months ago`;
    return `${years}y ago`;
  }
}