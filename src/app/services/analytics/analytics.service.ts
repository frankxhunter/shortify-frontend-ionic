import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap, map } from 'rxjs';
import { UrlAccessRequest, UrlAnalytics } from 'src/app/Dtos/interfaces';
import { environment } from 'src/environments/environment';
import { getMockAnalytics } from './analytics-mock-data';
import { IpGeolocationService } from '../ip-geolocation/ip-geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private geoService = inject(IpGeolocationService);

  getRequests(urlId: number): Observable<UrlAccessRequest[]> {
    if (environment.useMockAnalytics) {
      return of([]);
    }
    return this.http.get<UrlAccessRequest[]>(`${this.baseUrl}/api/urls/${urlId}/requests`);
  }

  mapRequestsToClickHistory(reqs: UrlAccessRequest[]): Observable<{
    clickHistory: Array<{
      id: string;
      clickedAt: string;
      ip: string;
      country: string;
      countryCode: string;
      referrer: string;
      referrerLabel: string;
      device: string;
      browser: string;
      os: string;
      path: string;
    }>;
    countryMap: Map<string, { country: string; countryCode: string }>;
  }> {
    const ips = reqs.map(r => r.ip ?? '');

    return this.geoService.resolveCountries(ips).pipe(
      map(countryMap => ({
        clickHistory: reqs.map(r => {
          const ip = r.ip ?? '';
          const geo = countryMap.get(ip);
          return {
            id: String(r.id),
            clickedAt: r.date,
            ip,
            country: geo?.country ?? 'Unknown',
            countryCode: geo?.countryCode ?? '--',
            referrer: '',
            referrerLabel: 'Direct',
            device: this.inferDeviceFrom(r.architecture, r.os),
            browser: r.browser ?? 'Unknown',
            os: r.os ?? 'Unknown',
            path: '',
          };
        }),
        countryMap,
      })),
    );
  }

  buildAnalyticsFromRequests(
    requests: UrlAccessRequest[],
    urlId: number,
    countryMap?: Map<string, { country: string; countryCode: string }>,
  ): UrlAnalytics {
    if (environment.useMockAnalytics) {
      return getMockAnalytics(urlId, 'all');
    }

    if (requests.length === 0) {
      return {
        urlId,
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

    const totalClicks = requests.length;
    const uniqueClicks = new Set(requests.map(r => r.ip)).size;
    const lastClickedAt = requests.map(r => r.date).sort().slice(-1)[0] ?? null;

    const clicksOverTimeMap = new Map<string, number>();
    requests.forEach(r => {
      const dateKey = r.date.slice(0, 10);
      clicksOverTimeMap.set(dateKey, (clicksOverTimeMap.get(dateKey) ?? 0) + 1);
    });
    const clicksOverTime = Array.from(clicksOverTimeMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, clicks]) => ({ date, clicks }));

    const browserMap = new Map<string, number>();
    requests.forEach(r => {
      const browser = r.browser ?? 'Unknown';
      browserMap.set(browser, (browserMap.get(browser) ?? 0) + 1);
    });
    const topBrowsers = Array.from(browserMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, clicks]) => ({ name, clicks, percentage: (clicks / totalClicks) * 100 }));

    const osMap = new Map<string, number>();
    requests.forEach(r => {
      const os = r.os ?? 'Unknown';
      osMap.set(os, (osMap.get(os) ?? 0) + 1);
    });
    const topOs = Array.from(osMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, clicks]) => ({ name, clicks, percentage: (clicks / totalClicks) * 100 }));

    const deviceSplit = { mobile: 0, desktop: 0, tablet: 0 };
    requests.forEach(r => {
      const device = this.inferDeviceFrom(r.architecture, r.os);
      switch (device.toLowerCase()) {
        case 'mobile': deviceSplit.mobile++; break;
        case 'tablet': deviceSplit.tablet++; break;
        default: deviceSplit.desktop++; break;
      }
    });

    const hourlyHeatmap = Array(24).fill(0);
    requests.forEach(r => {
      const hour = new Date(r.date).getHours();
      hourlyHeatmap[hour]++;
    });

    const countryCountMap = new Map<string, { country: string; countryCode: string; count: number }>();
    requests.forEach(r => {
      const ip = r.ip ?? '';
      const geo = countryMap?.get(ip);
      const country = geo?.country ?? 'Unknown';
      const countryCode = geo?.countryCode ?? '--';
      const key = `${countryCode}|${country}`;
      const current = countryCountMap.get(key);
      if (current) {
        current.count++;
      } else {
        countryCountMap.set(key, { country, countryCode, count: 1 });
      }
    });
    const topCountries = Array.from(countryCountMap.values())
      .sort((a, b) => b.count - a.count)
      .map(({ country, countryCode, count }) => ({
        country,
        countryCode,
        clicks: count,
        percentage: (count / totalClicks) * 100,
      }));

    return {
      urlId,
      totalClicks,
      uniqueClicks,
      lastClickedAt,
      clicksOverTime,
      topCountries,
      topReferrers: [],
      topBrowsers,
      topOs,
      deviceSplit,
      hourlyHeatmap,
    };
  }

  private inferDeviceFrom(architecture?: string, os?: string): string {
    const o = (os ?? '').toLowerCase();
    if (o.includes('android') || o.includes('ios')) return 'Mobile';
    return 'Desktop';
  }
}
