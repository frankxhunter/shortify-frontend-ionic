export interface UrlItem {
  id: number;
  clickCounter: number;
  originalUrl: string;
  shortUrl: string;
  creationDate: string;
  name: string;
}

export interface CreateUrlRequest {
  url: string;
  name: string;
}

export interface UrlRequest {
  id: number;
  ip: string;
  userAgent: string;
  accessedAt: string;
}

export interface UrlAccessRequest {
  id: number;
  ip: string;
  browser: string;
  os: string;
  architecture: string;
  date: string;
  country: string;
  countryCode: string;
}

export interface User {
  email: string;
  password: string;
}

export interface AuthTokensResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  refreshExpiresInMs: number;
  email: string;
}

export interface StoredAuthSession extends AuthTokensResponse {
  storedAt: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type AnalyticsRange = '7d' | '30d' | '90d' | 'all';

export interface TimeSeriesPoint {
  date: string;
  clicks: number;
}

export interface CountryStat {
  country: string;
  countryCode: string;
  clicks: number;
  percentage: number;
}

export interface ReferrerStat {
  referrer: string;
  clicks: number;
  percentage: number;
}

export interface DeviceStat {
  name: string;
  clicks: number;
  percentage: number;
}

export interface BrowserStat {
  name: string;
  clicks: number;
  percentage: number;
}

export interface OsStat {
  name: string;
  clicks: number;
  percentage: number;
}

export interface UrlAnalytics {
  urlId: number;
  totalClicks: number;
  uniqueClicks: number;
  lastClickedAt: string | null;
  clicksOverTime: TimeSeriesPoint[];
  topCountries: CountryStat[];
  topReferrers: ReferrerStat[];
  topBrowsers: BrowserStat[];
  topOs: OsStat[];
  deviceSplit: { mobile: number; desktop: number; tablet: number };
  hourlyHeatmap: number[];
}

export interface ClickHistoryEntry {
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
}
