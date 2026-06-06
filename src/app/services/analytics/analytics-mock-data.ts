import { UrlAnalytics } from 'src/app/Dtos/interfaces';

function generateDates(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString());
  }
  return dates;
}

function generateClicks(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 150));
}

const baseCountries = [
  { country: 'United States', countryCode: 'US' },
  { country: 'United Kingdom', countryCode: 'GB' },
  { country: 'Spain', countryCode: 'ES' },
  { country: 'Germany', countryCode: 'DE' },
  { country: 'France', countryCode: 'FR' },
  { country: 'Mexico', countryCode: 'MX' },
  { country: 'Brazil', countryCode: 'BR' },
  { country: 'Japan', countryCode: 'JP' },
  { country: 'Canada', countryCode: 'CA' },
  { country: 'India', countryCode: 'IN' },
];

const baseReferrers = [
  'https://twitter.com',
  'https://facebook.com',
  'https://reddit.com',
  'https://linkedin.com',
  'https://news.ycombinator.com',
  'https://t.co',
  '',
];

const baseBrowsers = [
  { name: 'Chrome' },
  { name: 'Firefox' },
  { name: 'Safari' },
  { name: 'Edge' },
  { name: 'Opera' },
  { name: 'Samsung Internet' },
];

const baseOs = [
  { name: 'Windows' },
  { name: 'macOS' },
  { name: 'Android' },
  { name: 'iOS' },
  { name: 'Linux' },
];

function buildCountries(totalClicks: number) {
  const shuffled = [...baseCountries].sort(() => Math.random() - 0.5);
  let remaining = totalClicks;
  return shuffled.map((c, i) => {
    const isLast = i === shuffled.length - 1;
    const clicks = isLast ? remaining : Math.floor(Math.random() * remaining * 0.3);
    remaining -= clicks;
    return {
      ...c,
      clicks,
      percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0,
    };
  }).filter(c => c.clicks > 0);
}

function buildReferrers(totalClicks: number) {
  const shuffled = [...baseReferrers].sort(() => Math.random() - 0.5);
  let remaining = totalClicks;
  return shuffled.map((r, i) => {
    const isLast = i === shuffled.length - 1;
    const clicks = isLast ? remaining : Math.floor(Math.random() * remaining * 0.3);
    remaining -= clicks;
    return {
      referrer: r,
      clicks,
      percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0,
    };
  }).filter(r => r.clicks > 0);
}

function buildItems<T extends { name?: string }>(items: T[], totalClicks: number) {
  let remaining = totalClicks;
  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    const clicks = isLast ? remaining : Math.floor(Math.random() * remaining * 0.3);
    remaining -= clicks;
    return {
      ...item,
      clicks,
      percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0,
    };
  }).filter(item => item.clicks > 0);
}

function buildHeatmap(): number[] {
  const weights = [
    0.01, 0.01, 0.01, 0.01, 0.02, 0.03,
    0.05, 0.08, 0.10, 0.12, 0.10, 0.08,
    0.06, 0.07, 0.09, 0.10, 0.09, 0.08,
    0.06, 0.05, 0.04, 0.03, 0.02, 0.01,
  ];
  const total = 500;
  return weights.map(w => Math.floor(total * w + Math.random() * 10));
}

function getDaysForRange(range: string): number {
  switch (range) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case 'all': return 180;
    default: return 7;
  }
}

export function getMockAnalytics(urlId: number, range: string): UrlAnalytics {
  const days = getDaysForRange(range);
  const totalClicks = Math.floor(Math.random() * 800) + 100;
  const uniqueClicks = Math.floor(totalClicks * 0.65);
  const dates = generateDates(days);
  const clicksData = generateClicks(days);

  return {
    urlId,
    totalClicks,
    uniqueClicks,
    lastClickedAt: new Date().toISOString(),
    clicksOverTime: dates.map((date, i) => ({ date, clicks: clicksData[i] })),
    topCountries: buildCountries(totalClicks),
    topReferrers: buildReferrers(totalClicks),
    topBrowsers: buildItems(baseBrowsers, totalClicks),
    topOs: buildItems(baseOs, totalClicks),
    deviceSplit: {
      mobile: Math.floor(Math.random() * 40) + 30,
      desktop: Math.floor(Math.random() * 30) + 20,
      tablet: Math.floor(Math.random() * 20) + 5,
    },
    hourlyHeatmap: buildHeatmap(),
  };
}
