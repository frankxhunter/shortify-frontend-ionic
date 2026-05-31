import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, IonSpinner, IonChip, IonSearchbar } from '@ionic/angular/standalone';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { UrlManager } from 'src/app/services/url-manager/url-manager';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { ClicksChartComponent } from './components/clicks-chart/clicks-chart.component';
import { DeviceChartComponent } from './components/device-chart/device-chart.component';
import { CountriesListComponent } from './components/countries-list/countries-list.component';

import { BrowsersChartComponent } from './components/browsers-chart/browsers-chart.component';
import { OsChartComponent } from './components/os-chart/os-chart.component';
import { HourlyHeatmapComponent } from './components/hourly-heatmap/hourly-heatmap.component';
import { ClickHistoryPanelComponent } from './components/click-history-panel/click-history-panel.component';
import { AnalyticsFiltersModalComponent, AnalyticsFiltersState, CountryFilterOption } from './components/analytics-filters-modal/analytics-filters-modal.component';
import { SkeletonLoaderComponent } from 'src/app/shared/components/skeleton-loader/skeleton-loader.component';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { ClickHistoryEntry, CountryStat, ReferrerStat, TimeSeriesPoint, UrlAnalytics } from 'src/app/Dtos/interfaces';
import { environment } from 'src/environments/environment';

type NamedStat = { name: string; clicks: number; percentage: number };

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonTitle,
    IonSpinner,
    IonChip,
    IonSearchbar,
    TranslatePipe,
    SummaryCardsComponent,
    ClicksChartComponent,
    DeviceChartComponent,
    CountriesListComponent,
    BrowsersChartComponent,
    OsChartComponent,
    HourlyHeatmapComponent,
    ClickHistoryPanelComponent,
    AnalyticsFiltersModalComponent,
    SkeletonLoaderComponent,
    // skeleton loader
    // Note: as a standalone component project uses, we add our shared skeleton loader here
    // The actual file is part of the repo under shared/components
  ],
})
export class AnalyticsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  analyticsService = inject(AnalyticsService);
  private urlManager = inject(UrlManager);

  useMock = environment.useMockAnalytics;

  urlId: number | null = null;
  analytics: UrlAnalytics | null = null;
  visibleAnalytics: UrlAnalytics | null = null;
  linkName: string = '';
  linkShortUrl: string = '';
  clickHistory: ClickHistoryEntry[] = [];
  visibleClickHistory: ClickHistoryEntry[] = [];
  countryOptions: CountryFilterOption[] = [];
  filtersModalOpen = false;
  searchTerm = '';
  filtersState: AnalyticsFiltersState = {
    dateFrom: '',
    dateTo: '',
    deviceFilter: 'all',
    countryFilter: 'all',
  };

  // local flag to show skeleton placeholders for at least 2 seconds
  showSkeleton = false;
  private skeletonTimer: any = null;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('urlId');
    if (idParam) {
      this.urlId = parseInt(idParam, 10);
      this.loadAnalytics();
    }
  }

  loadAnalytics() {
    if (!this.urlId) return;

    this.clickHistory = [];
    this.visibleClickHistory = [];
    this.visibleAnalytics = null;
    // show skeleton placeholders for a minimum of 2 seconds
    this.showSkeleton = true;
    if (this.skeletonTimer) {
      clearTimeout(this.skeletonTimer);
    }
    this.skeletonTimer = setTimeout(() => {
      this.showSkeleton = false;
      this.skeletonTimer = null;
    }, 2000);
    this.analyticsService.getAnalytics(this.urlId, 'all').subscribe({
      next: (data) => {
        this.analytics = data;
        this.clickHistory = this.buildClickHistory(data);
        this.countryOptions = this.buildCountryOptions(this.clickHistory);
        this.applyFilters();
        const url = this.urlManager.urls().find(u => u.id === this.urlId);
        if (url) {
          this.linkName = url.name || url.shortUrl;
          this.linkShortUrl = url.shortUrl;
        }
        // if data arrives after 2s, visible content will already be shown; if it arrives earlier
        // the skeleton will still be visible until the timer completes
      },
      error: () => {
        this.analytics = null;
        this.visibleAnalytics = null;
        this.clickHistory = [];
        this.visibleClickHistory = [];
        // hide skeleton if there was an error and the timer is still pending
        if (this.skeletonTimer) {
          clearTimeout(this.skeletonTimer);
          this.skeletonTimer = null;
        }
        this.showSkeleton = false;
      },
    });
  }

  openFiltersModal(): void {
    this.filtersModalOpen = true;
  }

  onFiltersApplied(state: AnalyticsFiltersState): void {
    this.filtersState = { ...state };
    this.applyFilters();
  }

  onFiltersDismissed(open: boolean): void {
    this.filtersModalOpen = open;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filtersState = {
      dateFrom: '',
      dateTo: '',
      deviceFilter: 'all',
      countryFilter: 'all',
    };
    this.applyFilters();
  }

  goBack() {
    this.router.navigate(['/']);
  }

  get hasActiveFilters(): boolean {
    return this.searchTerm.trim().length > 0 ||
      this.filtersState.dateFrom !== '' ||
      this.filtersState.dateTo !== '' ||
      this.filtersState.deviceFilter !== 'all' ||
      this.filtersState.countryFilter !== 'all';
  }

  onSearchChange(event: CustomEvent): void {
    this.searchTerm = String(event.detail?.value ?? '');
    this.applyFilters();
  }

  private applyFilters() {
    if (!this.analytics) {
      this.visibleAnalytics = null;
      this.visibleClickHistory = [];
      return;
    }

    const filteredEntries = this.filterHistoryEntries(this.clickHistory);
    this.visibleClickHistory = filteredEntries;
    this.visibleAnalytics = this.hasActiveFilters
      ? this.buildAnalyticsView(this.analytics, filteredEntries)
      : this.analytics;
  }

  private filterHistoryEntries(entries: ClickHistoryEntry[]): ClickHistoryEntry[] {
    const term = this.searchTerm.trim().toLowerCase();
    const dateRange = this.getDateRange(this.filtersState.dateFrom, this.filtersState.dateTo);

    return entries.filter(entry => {
      const matchesSearch =
        term.length === 0 ||
        [
          entry.ip,
          entry.country,
          entry.countryCode,
          entry.referrerLabel,
          entry.device,
          entry.browser,
          entry.os,
          entry.path,
        ].some(value => value.toLowerCase().includes(term));

      const matchesTime = !dateRange ||
        (new Date(entry.clickedAt).getTime() >= dateRange.start && new Date(entry.clickedAt).getTime() <= dateRange.end);

      const matchesDevice = this.filtersState.deviceFilter === 'all' || entry.device.toLowerCase() === this.filtersState.deviceFilter;

      const matchesCountry =
        this.filtersState.countryFilter === 'all' ||
        entry.countryCode.toLowerCase() === this.filtersState.countryFilter.toLowerCase();

      return matchesSearch && matchesTime && matchesDevice && matchesCountry;
    });
  }

  private getDateRange(from: string, to: string): { start: number; end: number } | null {
    if (!from && !to) {
      return null;
    }

    const start = from ? this.parseDateInput(from, false) : Number.NEGATIVE_INFINITY;
    const end = to ? this.parseDateInput(to, true) : Number.POSITIVE_INFINITY;

    if (Number.isNaN(start) || Number.isNaN(end)) {
      return null;
    }

    return start <= end ? { start, end } : { start: end, end: start };
  }

  private parseDateInput(value: string, endOfDay: boolean): number {
    const normalized = value.trim();

    const ddMmYyyy = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddMmYyyy) {
      const [, day, month, year] = ddMmYyyy;
      return new Date(`${year}-${month}-${day}T${endOfDay ? '23:59:59.999' : '00:00:00'}`).getTime();
    }

    const yyyyMmDd = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyyMmDd) {
      const [, year, month, day] = yyyyMmDd;
      return new Date(`${year}-${month}-${day}T${endOfDay ? '23:59:59.999' : '00:00:00'}`).getTime();
    }

    return Number.NaN;
  }

  private buildClickHistory(analytics: UrlAnalytics): ClickHistoryEntry[] {
    const totalEntries = Math.min(Math.max(analytics.totalClicks, 0), 40);

    if (totalEntries === 0) {
      return [];
    }

    const random = this.createSeededRandom(
      analytics.urlId * 97 +
      analytics.totalClicks * 31 +
      analytics.uniqueClicks * 17
    );

    const days = analytics.clicksOverTime.length > 0
      ? analytics.clicksOverTime
      : [{ date: new Date().toISOString(), clicks: 1 }];

    const countries = analytics.topCountries.length > 0
      ? analytics.topCountries
      : [{ country: 'Unknown', countryCode: '--', clicks: 1, percentage: 100 }];

    const referrers = analytics.topReferrers.length > 0
      ? analytics.topReferrers
      : [{ referrer: '', clicks: 1, percentage: 100 }];

    const browsers = analytics.topBrowsers.length > 0
      ? analytics.topBrowsers
      : [{ name: 'Browser', clicks: 1, percentage: 100 }];

    const osList = analytics.topOs.length > 0
      ? analytics.topOs
      : [{ name: 'OS', clicks: 1, percentage: 100 }];

    const devices = this.expandDevices(analytics.deviceSplit);
    const hostId = this.normalizeHostId(analytics.urlId);

    return Array.from({ length: totalEntries }, (_, index) => {
      const date = new Date(days[Math.floor(random() * days.length)].date);
      const minuteOffset = Math.floor(random() * 60);
      const hourOffset = Math.floor(random() * 24);
      date.setHours(hourOffset, minuteOffset, Math.floor(random() * 60), 0);
      date.setMinutes(date.getMinutes() - index * 4);

      const country = countries[Math.floor(random() * countries.length)];
      const referrer = referrers[Math.floor(random() * referrers.length)];
      const browser = browsers[Math.floor(random() * browsers.length)];
      const os = osList[Math.floor(random() * osList.length)];
      const device = devices[Math.floor(random() * devices.length)];

      return {
        id: `${hostId}-${index + 1}`,
        clickedAt: date.toISOString(),
        ip: this.buildMockIp(analytics.urlId, index, random),
        country: country.country,
        countryCode: country.countryCode,
        referrer: referrer.referrer,
        referrerLabel: this.formatReferrer(referrer.referrer),
        device,
        browser: browser.name,
        os: os.name,
        path: this.buildMockPath(analytics.urlId, index, random),
      };
    }).sort((a, b) => new Date(b.clickedAt).getTime() - new Date(a.clickedAt).getTime());
  }

  private buildAnalyticsView(base: UrlAnalytics, entries: ClickHistoryEntry[]): UrlAnalytics {
    if (entries.length === 0) {
      return {
        urlId: base.urlId,
        totalClicks: 0,
        uniqueClicks: 0,
        lastClickedAt: null,
        clicksOverTime: [],
        topCountries: [],
        topReferrers: [],
        topBrowsers: [],
        topOs: [],
        deviceSplit: { mobile: 0, desktop: 0, tablet: 0 },
        hourlyHeatmap: Array(24).fill(0),
      };
    }

    return {
      urlId: base.urlId,
      totalClicks: entries.length,
      uniqueClicks: new Set(entries.map(entry => entry.ip)).size,
      lastClickedAt: entries.map(entry => entry.clickedAt).sort().slice(-1)[0] ?? null,
      clicksOverTime: this.buildTimeSeries(entries),
      topCountries: this.buildCountryStats(entries),
      topReferrers: this.buildReferrerStats(entries),
      topBrowsers: this.buildNamedStats(entries, entry => entry.browser),
      topOs: this.buildNamedStats(entries, entry => entry.os),
      deviceSplit: this.buildDeviceSplit(entries),
      hourlyHeatmap: this.buildHourlyHeatmap(entries),
    };
  }

  private buildCountryOptions(entries: ClickHistoryEntry[]): CountryFilterOption[] {
    const grouped = new Map<string, string>();

    entries.forEach(entry => {
      if (!grouped.has(entry.countryCode)) {
        grouped.set(entry.countryCode, entry.country);
      }
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([code, label]) => ({ code, label }));
  }

  private buildTimeSeries(entries: ClickHistoryEntry[]): TimeSeriesPoint[] {
    const grouped = new Map<string, number>();

    entries.forEach(entry => {
      const dateKey = new Date(entry.clickedAt).toISOString().slice(0, 10);
      grouped.set(dateKey, (grouped.get(dateKey) ?? 0) + 1);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, clicks]) => ({ date, clicks }));
  }

  private buildCountryStats(entries: ClickHistoryEntry[]): CountryStat[] {
    const stats = this.buildCountMap(entries, entry => `${entry.countryCode}|${entry.country}`, entry => ({
      countryCode: entry.countryCode,
      country: entry.country,
    }));

    return stats.map(stat => ({
      country: stat.label.country,
      countryCode: stat.label.countryCode,
      clicks: stat.clicks,
      percentage: (stat.clicks / entries.length) * 100,
    }));
  }

  private buildReferrerStats(entries: ClickHistoryEntry[]): ReferrerStat[] {
    const stats = this.buildCountMap(entries, entry => entry.referrer || 'direct', entry => ({
      referrer: entry.referrer,
      referrerLabel: entry.referrerLabel,
    }));

    return stats.map(stat => ({
      referrer: stat.label.referrer,
      clicks: stat.clicks,
      percentage: (stat.clicks / entries.length) * 100,
    }));
  }

  private buildNamedStats(
    entries: ClickHistoryEntry[],
    selector: (entry: ClickHistoryEntry) => string
  ): NamedStat[] {
    const stats = this.buildCountMap(entries, entry => selector(entry), entry => ({ name: selector(entry) }));

    return stats.map(stat => ({
      name: stat.label.name,
      clicks: stat.clicks,
      percentage: (stat.clicks / entries.length) * 100,
    }));
  }

  private buildDeviceSplit(entries: ClickHistoryEntry[]): UrlAnalytics['deviceSplit'] {
    const counts: UrlAnalytics['deviceSplit'] = { mobile: 0, desktop: 0, tablet: 0 };

    entries.forEach(entry => {
      switch (entry.device.toLowerCase()) {
        case 'mobile':
          counts.mobile += 1;
          break;
        case 'desktop':
          counts.desktop += 1;
          break;
        case 'tablet':
          counts.tablet += 1;
          break;
      }
    });

    return counts;
  }

  private buildHourlyHeatmap(entries: ClickHistoryEntry[]): number[] {
    const heatmap = Array(24).fill(0);

    entries.forEach(entry => {
      const hour = new Date(entry.clickedAt).getHours();
      heatmap[hour] += 1;
    });

    return heatmap;
  }

  private buildCountMap<TLabel>(
    entries: ClickHistoryEntry[],
    keySelector: (entry: ClickHistoryEntry) => string,
    labelSelector: (entry: ClickHistoryEntry) => TLabel
  ): Array<{ label: TLabel; clicks: number }> {
    const grouped = new Map<string, { label: TLabel; clicks: number }>();

    entries.forEach(entry => {
      const key = keySelector(entry);
      const current = grouped.get(key);
      if (current) {
        current.clicks += 1;
      } else {
        grouped.set(key, { label: labelSelector(entry), clicks: 1 });
      }
    });

    return Array.from(grouped.values()).sort((a, b) => b.clicks - a.clicks);
  }

  private createSeededRandom(seed: number): () => number {
    let current = Math.abs(seed) % 2147483647;
    if (current === 0) {
      current = 1;
    }

    return () => {
      current = (current * 16807) % 2147483647;
      return (current - 1) / 2147483646;
    };
  }

  private expandDevices(deviceSplit: UrlAnalytics['deviceSplit']): string[] {
    const devices = [
      ...Array(Math.max(1, Math.round(deviceSplit.desktop / 10))).fill('Desktop'),
      ...Array(Math.max(1, Math.round(deviceSplit.mobile / 10))).fill('Mobile'),
      ...Array(Math.max(1, Math.round(deviceSplit.tablet / 10))).fill('Tablet'),
    ];

    return devices.length > 0 ? devices : ['Desktop'];
  }

  private buildMockIp(urlId: number, index: number, random: () => number): string {
    const first = 172 + (urlId % 10);
    const second = Math.floor(random() * 254);
    const third = Math.floor(random() * 254);
    const fourth = 10 + index;
    return `${first}.${second}.${third}.${fourth}`;
  }

  private buildMockPath(urlId: number, index: number, random: () => number): string {
    const token = Math.floor(random() * 9000 + 1000);
    return `/r/${urlId}-${index + 1}-${token}`;
  }

  private formatReferrer(referrer: string): string {
    if (!referrer) {
      return 'Direct';
    }

    try {
      return new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      return referrer.replace(/^https?:\/\//, '');
    }
  }

  private normalizeHostId(urlId: number): string {
    return `CLK-${String(urlId).padStart(3, '0')}`;
  }
}
