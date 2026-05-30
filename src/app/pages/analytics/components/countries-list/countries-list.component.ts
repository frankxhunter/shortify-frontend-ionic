import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryStat } from 'src/app/Dtos/interfaces';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { IonCard, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, IonCard, IonCardTitle],
})
export class CountriesListComponent {
  @Input({ required: true }) countries: CountryStat[] = [];

  getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }
}
