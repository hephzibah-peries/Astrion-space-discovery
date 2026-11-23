import { ApodItem, ApodApiError } from '../types/apod.types';
import { apodCache } from './apodCache';

const NASA_APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const DEFAULT_NASA_KEY = 'DEMO_KEY';

/**
 * Retrieves the configured NASA API key from environment variables,
 * falling back to DEMO_KEY if not configured.
 */
export const getNasaApiKey = (): string => {
  const envKey = process.env.EXPO_PUBLIC_NASA_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey.trim();
  }
  return DEFAULT_NASA_KEY;
};

/**
 * Formats user-friendly NASA API error messages based on HTTP status
 * and NASA API response codes.
 */
export const parseNasaApiError = (status: number, data?: ApodApiError): string => {
  if (status === 403) {
    return (
      data?.error?.message ||
      'Invalid or unauthorized NASA API key. Check your EXPO_PUBLIC_NASA_API_KEY configuration.'
    );
  }
  if (status === 429) {
    return (
      data?.error?.message ||
      'NASA API rate limit exceeded. The DEMO_KEY allows 30 requests/hour and 50 requests/day. Consider setting EXPO_PUBLIC_NASA_API_KEY with a personal key from api.nasa.gov.'
    );
  }
  if (status >= 500) {
    return 'NASA planetary servers are currently experiencing difficulties. Please try again shortly.';
  }
  return data?.error?.message || data?.msg || `Unable to retrieve astronomy data (HTTP ${status}).`;
};

/**
 * Sanitizes and normalizes an APOD API response item, ensuring
 * safe fallbacks for missing or optional fields.
 */
export const sanitizeApodItem = (raw: Partial<ApodItem>): ApodItem => {
  return {
    date: raw.date || new Date().toISOString().split('T')[0],
    title: raw.title?.trim() || 'Astronomy Picture of the Day',
    explanation:
      raw.explanation?.trim() ||
      'No scientific explanation was provided by NASA for this astronomical feature.',
    media_type: raw.media_type || 'image',
    url: raw.url || 'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png',
    hdurl: raw.hdurl,
    copyright: raw.copyright ? raw.copyright.replace(/\n/g, ' ').trim() : undefined,
    service_version: raw.service_version || 'v1',
    thumbnail_url: raw.thumbnail_url,
  };
};

export const nasaApi = {
  /**
   * Fetches the current day's Astronomy Picture of the Day.
   * Leverages in-memory cache to prevent redundant requests across tab navigation.
   *
   * @param forceRefresh - If true, bypasses in-memory cache and fetches fresh data
   * @param signal - Optional AbortSignal for cancelable requests
   */
  async fetchTodayApod(forceRefresh = false, signal?: AbortSignal): Promise<ApodItem> {
    if (!forceRefresh) {
      const cached = apodCache.getToday();
      if (cached) {
        return cached;
      }
    }

    const apiKey = getNasaApiKey();
    const endpoint = `${NASA_APOD_BASE_URL}?api_key=${encodeURIComponent(apiKey)}&thumbs=true`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(parseNasaApiError(response.status, data));
      }

      const item = sanitizeApodItem(data);
      apodCache.setToday(item);
      return item;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('Network')) {
        throw new Error(
          'Network connection unavailable. Please check your internet connection and try again.'
        );
      }
      throw error;
    }
  },

  /**
   * Retrieves an APOD item from cache by its identifier or date.
   */
  getCachedApod(id: string): ApodItem | undefined {
    return apodCache.get(id);
  },
};
