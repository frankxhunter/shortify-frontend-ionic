import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

export interface AnalyticsFiltersState {
  dateFrom: string;
  dateTo: string;
  deviceFilter: 'all' | 'desktop' | 'mobile' | 'tablet';
  countryFilter: string;
}

export interface CountryFilterOption {
  code: string;
  label: string;
}

@Component({
  selector: 'app-analytics-filters-modal',
  templateUrl: './analytics-filters-modal.component.html',
  styleUrls: ['./analytics-filters-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonTitle,
    IonModal,
    TranslatePipe,
  ],
})
export class AnalyticsFiltersModalComponent implements OnChanges {
  @Input() isOpen = false;
@Input() state: AnalyticsFiltersState = {
  dateFrom: '',
  dateTo: '',
  deviceFilter: 'all',
  countryFilter: 'all',
};
  @Input() countryOptions: CountryFilterOption[] = [];
  @Input() hasActiveFilters = false;
  @Input() filteredCount = 0;
  @Input() totalCount = 0;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() applied = new EventEmitter<AnalyticsFiltersState>();
  @Output() reset = new EventEmitter<void>();

  @ViewChild('dateFromInput') dateFromInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dateToInput') dateToInputRef!: ElementRef<HTMLInputElement>;

  workingState: AnalyticsFiltersState = { ...this.state };
  countrySearchTerm = '';
  dateFromNative = '';
  dateToNative = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
      this.workingState = { ...this.state };
      this.dateFromNative = this.toNativeDate(this.state.dateFrom);
      this.dateToNative = this.toNativeDate(this.state.dateTo);
    }

    if (changes['isOpen']?.currentValue === true && !changes['isOpen']?.previousValue) {
      this.countrySearchTerm = '';
    }
  }

  dismiss(): void {
    this.isOpenChange.emit(false);
  }

  apply(): void {
    this.applied.emit({ ...this.workingState });
    this.dismiss();
  }

  openDateFrom(): void {
    const input = this.dateFromInputRef?.nativeElement;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.click();
    }
  }

  openDateTo(): void {
    const input = this.dateToInputRef?.nativeElement;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.click();
    }
  }

  onNativeDateFromChange(event: Event): void {
    this.setDateFrom(this.fromNativeDate((event.target as HTMLInputElement).value));
  }

  onNativeDateToChange(event: Event): void {
    this.setDateTo(this.fromNativeDate((event.target as HTMLInputElement).value));
  }

  setDateFrom(value: string): void {
    this.workingState = { ...this.workingState, dateFrom: value };
    this.dateFromNative = this.toNativeDate(value);
  }

  setDateTo(value: string): void {
    this.workingState = { ...this.workingState, dateTo: value };
    this.dateToNative = this.toNativeDate(value);
  }

  setDeviceFilter(value: AnalyticsFiltersState['deviceFilter']): void {
    this.workingState = { ...this.workingState, deviceFilter: value };
  }



  setCountryFilter(value: string): void {
    this.workingState = { ...this.workingState, countryFilter: value };
  }

  onCountrySearchChange(event: CustomEvent): void {
    this.countrySearchTerm = String(event.detail?.value ?? '');
  }

  clearAll(): void {
    this.countrySearchTerm = '';
    this.reset.emit();
  }

  get filteredCountryOptions(): CountryFilterOption[] {
    const term = this.countrySearchTerm.trim().toLowerCase();
    if (!term) return this.countryOptions;
    return this.countryOptions.filter(option =>
      option.label.toLowerCase().includes(term) ||
      option.code.toLowerCase().includes(term)
    );
  }

  getCountryFlagEmoji(countryCode: string): string {
    const normalized = countryCode.trim().toUpperCase();
    if (normalized.length !== 2 || /[^A-Z]/.test(normalized)) return '🌐';
    const codePoints = normalized.split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  private fromNativeDate(value: string): string {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return '';
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  private toNativeDate(value: string): string {
    const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month}-${day}`;
    }
    const nativeMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (nativeMatch) return value.trim();
    return '';
  }
}