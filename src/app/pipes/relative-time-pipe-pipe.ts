import { inject, Pipe, PipeTransform } from '@angular/core';
import { RelativeTimeService } from '../services/relative-time/relative-time';

@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: false,
})
export class RelativeTimePipe implements PipeTransform {

  relativeTimeService = inject(RelativeTimeService)


  transform(date: Date | string): string {
    return this.relativeTimeService.getRelativeTime(date);
  }
}