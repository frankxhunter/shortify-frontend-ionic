import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, forkJoin, delay, switchMap, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GeolocationResult {
  country: string;
  countryCode: string;
}

interface IpApiSuccessResponse {
  ip: string;
  country: string;
  country_code: string;
  error?: boolean;
  reason?: string;
}

const UNKNOWN_RESULT: GeolocationResult = { country: 'Unknown', countryCode: '--' };

const PRIVATE_IP_PREFIXES = ['127.', '10.', '192.168.', '172.16.', '172.17.', '172.18.',
  '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.',
  '172.27.', '172.28.', '172.29.', '172.30.', '172.31.'];

@Injectable({
  providedIn: 'root',
})
export class IpGeolocationService {
  private http = inject(HttpClient);
  private cache = new Map<string, GeolocationResult>();

  private readonly API_BASE = 'https://ipapi.co';
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_DELAY_MS = 1100;

  resolveCountries(ips: string[]): Observable<Map<string, GeolocationResult>> {
    const uniqueIps = [...new Set(ips.filter(ip => ip && ip.trim().length > 0))];

    if (uniqueIps.length === 0) {
      return of(new Map<string, GeolocationResult>());
    }

    const uncachedIps = uniqueIps.filter(ip => !this.isPrivateIp(ip) && !this.cache.has(ip));

    if (uncachedIps.length === 0) {
      return of(this.buildResultMap(uniqueIps));
    }

    return this.resolveBatched(uncachedIps).pipe(
      switchMap(() => of(this.buildResultMap(uniqueIps))),
      catchError(() => of(this.buildResultMap(uniqueIps))),
    );
  }

  private isPrivateIp(ip: string): boolean {
    const trimmed = ip.trim();
    if (trimmed === 'localhost' || trimmed === '::1' || trimmed === '0.0.0.0') {
      return true;
    }
    return PRIVATE_IP_PREFIXES.some(prefix => trimmed.startsWith(prefix));
  }

  private buildResultMap(ips: string[]): Map<string, GeolocationResult> {
    const result = new Map<string, GeolocationResult>();
    for (const ip of ips) {
      if (this.isPrivateIp(ip)) {
        result.set(ip, UNKNOWN_RESULT);
      } else if (this.cache.has(ip)) {
        result.set(ip, this.cache.get(ip)!);
      } else {
        result.set(ip, UNKNOWN_RESULT);
      }
    }
    return result;
  }

  private resolveBatched(ips: string[]): Observable<void> {
    const batches: string[][] = [];
    for (let i = 0; i < ips.length; i += this.BATCH_SIZE) {
      batches.push(ips.slice(i, i + this.BATCH_SIZE));
    }

    if (batches.length === 0) {
      return of(undefined);
    }

    let chain: Observable<void> = of(undefined);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchIndex = i;

      chain = chain.pipe(
        switchMap(() => {
          const requests = batch.map(ip => this.resolveSingle(ip));
          const batch$ = requests.length === 1
            ? requests[0].pipe(map(() => undefined))
            : forkJoin(requests).pipe(map(() => undefined));

          return batch$.pipe(
            catchError(() => of(undefined)),
            batchIndex < batches.length - 1 ? delay(this.BATCH_DELAY_MS) : map(v => v),
          );
        }),
      );
    }

    return chain;
  }

  private resolveSingle(ip: string): Observable<void> {
    if (this.cache.has(ip)) {
      return of(undefined);
    }

    return this.http.get<IpApiSuccessResponse>(`${this.API_BASE}/${ip}/json/`).pipe(
      map(response => {
        if (response.error || !response.country_code || !response.country) {
          this.cache.set(ip, UNKNOWN_RESULT);
        } else {
          this.cache.set(ip, {
            country: response.country,
            countryCode: response.country_code,
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.cache.set(ip, UNKNOWN_RESULT);
        return of(undefined);
      }),
    );
  }
}
