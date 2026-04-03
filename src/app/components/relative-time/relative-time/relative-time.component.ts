import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-relative-time',
  templateUrl: './relative-time.component.html',
  styleUrls: ['./relative-time.component.scss'],
  standalone: true,
})
export class RelativeTimeComponent implements OnInit, OnDestroy {
  @Input() date!: Date | string;

  relativeTime: string = '';
  private interval: any;

  ngOnInit() {
    this.update();
    this.interval = setInterval(() => this.update(), 60000); // actualiza cada minuto
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  private update() {
    const now = new Date();
    const past = new Date(this.date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      this.relativeTime = 'Just now';
    } else if (minutes < 60) {
      this.relativeTime = `${minutes}m ago`;
    } else if (hours < 24) {
      this.relativeTime = `${hours}h ago`;
    } else if (days === 1) {
      this.relativeTime = 'Yesterday';
    } else if (days < 7) {
      this.relativeTime = `${days} days ago`;
    } else if (weeks < 4) {
      this.relativeTime = `${weeks}w ago`;
    } else if (months < 12) {
      this.relativeTime = `${months} months ago`;
    } else {
      this.relativeTime = `${years}y ago`;
    }
  }
}