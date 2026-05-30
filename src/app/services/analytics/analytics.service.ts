import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, defer, of, catchError, throwError, delay, finalize } from 'rxjs';
import { AnalyticsRange, UrlAnalytics } from 'src/app/Dtos/interfaces';
import { environment } from 'src/environments/environment';
import { getMockAnalytics } from './analytics-mock-data';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private cache = new Map<string, UrlAnalytics>();
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly isLoading = this.loading.asReadonly();
  readonly hasError = this.error.asReadonly();

  getAnalytics(urlId: number, range: AnalyticsRange = '7d'): Observable<UrlAnalytics> {
    const cacheKey = `${urlId}-${range}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey)!);
    }

    this.loading.set(true);
    this.error.set(null);

    const stream$: Observable<UrlAnalytics> = environment.useMockAnalytics
      ? defer(() => of(getMockAnalytics(urlId, range))).pipe(delay(600))
      : (() => {
          const params = new HttpParams().set('range', range);
          return this.http.get<UrlAnalytics>(`${this.baseUrl}/api/urls/${urlId}/analytics`, { params });
        })();

    return stream$.pipe(
      catchError(err => {
        this.error.set(err?.error?.message || err?.message || 'Failed to load analytics');
        return throwError(() => err);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  clearCache(urlId?: number): void {
    if (urlId !== undefined) {
      const keys = Array.from(this.cache.keys()).filter(k => k.startsWith(`${urlId}-`));
      keys.forEach(k => this.cache.delete(k));
    } else {
      this.cache.clear();
    }
  }
}
