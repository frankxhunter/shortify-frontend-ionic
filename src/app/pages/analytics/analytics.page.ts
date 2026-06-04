import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, IonChip, IonSearchbar } from '@ionic/angular/standalone';
import { switchMap, map } from 'rxjs/operators';
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
    this.showSkeleton = true;
    if (this.skeletonTimer) {
      clearTimeout(this.skeletonTimer);
    }
    this.skeletonTimer = setTimeout(() => {
      this.showSkeleton = false;
      this.skeletonTimer = null;
    }, 2000);

    const url = this.urlManager.urls().find(u => u.id === this.urlId);
    if (url) {
      this.linkName = url.name || url.shortUrl;
      this.linkShortUrl = url.shortUrl;
    }

    this.analyticsService.getRequests(this.urlId).pipe(
      switchMap(reqs => this.analyticsService.mapRequestsToClickHistory(reqs).pipe(
        map(({ clickHistory, countryMap }) => ({
          reqs,
          clickHistory,
          countryMap,
        })),
      )),
    ).subscribe({
      next: ({ reqs, clickHistory, countryMap }) => {
        this.clickHistory = clickHistory;
        this.analytics = this.analyticsService.buildAnalyticsFromRequests(reqs, this.urlId!, countryMap);
        this.countryOptions = this.buildCountryOptions(this.clickHistory);
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load requests', err);
        this.analytics = null;
        this.visibleAnalytics = null;
        this.clickHistory = [];
        this.visibleClickHistory = [];
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
    this.visibleClickHistory = filteredEntries.sort((a, b)=> b.clickedAt.localeCompare(a.clickedAt));
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

}
