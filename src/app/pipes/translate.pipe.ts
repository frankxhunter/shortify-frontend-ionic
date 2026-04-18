import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../services/i18n/i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18nService = inject(I18nService);

  transform(key: string, params?: Record<string, string | number>): string {
    this.i18nService.language();
    return this.i18nService.translate(key, params);
  }
}
