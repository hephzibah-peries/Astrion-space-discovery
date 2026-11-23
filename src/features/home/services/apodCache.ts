import { ApodItem } from '../types/apod.types';

/**
 * In-memory cache for APOD items to prevent redundant network fetches
 * during tab switches or navigation between Home and Details.
 */
class ApodCache {
  private cache: Map<string, ApodItem> = new Map();
  private todayApod: ApodItem | null = null;
  private lastFetchedTime: number = 0;
  private readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

  setToday(item: ApodItem): void {
    this.todayApod = item;
    this.lastFetchedTime = Date.now();
    this.cache.set('today', item);
    this.cache.set(item.date, item);
    this.cache.set(`apod-${item.date}`, item);
  }

  getToday(): ApodItem | null {
    if (!this.todayApod) return null;
    const isExpired = Date.now() - this.lastFetchedTime > this.CACHE_TTL_MS;
    if (isExpired) return null;
    return this.todayApod;
  }

  set(id: string, item: ApodItem): void {
    this.cache.set(id, item);
    this.cache.set(item.date, item);
  }

  get(id: string): ApodItem | undefined {
    if (id === 'today' || id === 'apod-today') {
      return this.todayApod || this.cache.get('today');
    }
    return this.cache.get(id);
  }

  clear(): void {
    this.cache.clear();
    this.todayApod = null;
    this.lastFetchedTime = 0;
  }
}

export const apodCache = new ApodCache();
