import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, IonSpinner } from '@ionic/angular/standalone';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { UrlManager } from 'src/app/services/url-manager/url-manager';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { ClicksChartComponent } from './components/clicks-chart/clicks-chart.component';
import { DeviceChartComponent } from './components/device-chart/device-chart.component';
import { CountriesListComponent } from './components/countries-list/countries-list.component';
import { ReferrersListComponent } from './components/referrers-list/referrers-list.component';
import { BrowsersChartComponent } from './components/browsers-chart/browsers-chart.component';
import { OsChartComponent } from './components/os-chart/os-chart.component';
import { HourlyHeatmapComponent } from './components/hourly-heatmap/hourly-heatmap.component';
import { RangeSelectorComponent } from './components/range-selector/range-selector.component';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { AnalyticsRange, UrlAnalytics } from 'src/app/Dtos/interfaces';
import { environment } from 'src/environments/environment';

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
    TranslatePipe,
    SummaryCardsComponent,
    ClicksChartComponent,
    DeviceChartComponent,
    CountriesListComponent,
    ReferrersListComponent,
    BrowsersChartComponent,
    OsChartComponent,
    HourlyHeatmapComponent,
    RangeSelectorComponent,
  ],
})
export class AnalyticsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  analyticsService = inject(AnalyticsService);
  private urlManager = inject(UrlManager);

  useMock = environment.useMockAnalytics;

  urlId: number | null = null;
  selectedRange = signal<AnalyticsRange>('7d');
  analytics: UrlAnalytics | null = null;
  linkName: string = '';
  linkShortUrl: string = '';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('urlId');
    if (idParam) {
      this.urlId = parseInt(idParam, 10);
      this.loadAnalytics();
    }
  }

  loadAnalytics() {
    if (!this.urlId) return;

    const range = this.selectedRange();
    this.analyticsService.getAnalytics(this.urlId, range).subscribe({
      next: (data) => {
        this.analytics = data;
        const url = this.urlManager.urls().find(u => u.id === this.urlId);
        if (url) {
          this.linkName = url.name || url.shortUrl;
          this.linkShortUrl = url.shortUrl;
        }
      },
      error: () => {
        this.analytics = null;
      },
    });
  }

  onRangeChange(range: AnalyticsRange) {
    this.selectedRange.set(range);
    this.loadAnalytics();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
