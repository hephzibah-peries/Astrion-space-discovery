import { ApodItem, ApodApiError, NasaApodBasicRecord } from '../types/apod.types';
import { apodCache } from './apodCache';

/**
 * NASA Science WordPress REST endpoint for APOD data:
 * Returns an array of recent APOD records (typically 25 items).
 */
export const NASA_APOD_BASE_URL = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/';
export const DEFAULT_NASA_KEY = 'DEMO_KEY';
export const FALLBACK_IMAGE_URL =
  'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png';

/**
 * Retrieves the configured NASA API key from environment variables,
 * falling back to DEMO_KEY if not configured.
 */
export const getNasaApiKey = (envOverride?: string): string => {
  const envKey = envOverride !== undefined ? envOverride : process.env.EXPO_PUBLIC_NASA_API_KEY;
  if (envKey && envKey.trim() !== '') {
    return envKey.trim();
  }
  return DEFAULT_NASA_KEY;
};

/**
 * Decodes standard HTML entities into clean Unicode text.
 */
export const decodeHtmlEntities = (str?: string): string => {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&#8216;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&rdquo;|&ldquo;/g, '"')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
};

/**
 * Strips HTML tags and normalizes whitespace while preserving readable structure.
 */
export const stripHtml = (html?: string): string => {
  if (!html) return '';
  const noTags = html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '');
  const decoded = decodeHtmlEntities(noTags);
  return decoded.replace(/[ \t]+/g, ' ').trim();
};

/**
 * Extracts clean, human-readable plain text attribution from copyright or credit fields,
 * safely removing HTML links (e.g. <a href="...">Author</a> -> Author).
 */
export const cleanAttribution = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  const stripped = stripHtml(raw);
  const normalized = stripped.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  return normalized.length > 0 ? normalized : undefined;
};

/**
 * Sanitizes scientific explanation text, stripping HTML markup and decoding entities.
 * Removes redundant leading "Explanation:" label and trailing next-day teasers if present.
 */
export const cleanExplanation = (raw?: string): string => {
  if (!raw) {
    return 'No scientific explanation was provided by NASA for this astronomical feature.';
  }
  let text = stripHtml(raw);
  text = text.replace(/^Explanation:\s*/i, '').trim();
  text = text.replace(/Tomorrow's picture:.*$/i, '').trim();
  return text.length > 0
    ? text
    : 'No scientific explanation was provided by NASA for this astronomical feature.';
};

/**
 * Sorts and selects the latest available APOD record by date (descending).
 * Ensures that out-of-order array responses still resolve to the true latest observation.
 */
export const selectLatestApodRecord = (records: NasaApodBasicRecord[]): NasaApodBasicRecord => {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('NASA APOD service returned an empty catalog.');
  }

  const validRecords = records.filter(
    (item) => item && typeof item.date === 'string' && item.date.trim() !== ''
  );

  if (validRecords.length === 0) {
    throw new Error('NASA APOD service returned no records with valid astronomical dates.');
  }

  const sorted = [...validRecords].sort((a, b) => {
    const timeA = Date.parse(a.date) || 0;
    const timeB = Date.parse(b.date) || 0;
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return b.date.localeCompare(a.date);
  });

  return sorted[0];
};

/**
 * Formats user-friendly NASA API error messages based on HTTP status
 * and NASA API / WordPress response codes.
 */
export const parseNasaApiError = (status: number, data?: ApodApiError): string => {
  if (status === 403) {
    return (
      data?.error?.message ||
      data?.message ||
      'Invalid or unauthorized NASA API key. Check your EXPO_PUBLIC_NASA_API_KEY configuration.'
    );
  }
  if (status === 429) {
    return (
      data?.error?.message ||
      data?.message ||
      'NASA API rate limit exceeded. The DEMO_KEY allows 30 requests/hour and 50 requests/day. Consider setting EXPO_PUBLIC_NASA_API_KEY with a personal key from api.nasa.gov.'
    );
  }
  if (status >= 500) {
    return 'NASA planetary servers are currently experiencing difficulties. Please try again shortly.';
  }
  return (
    data?.error?.message ||
    data?.message ||
    data?.msg ||
    `Unable to retrieve astronomy data (HTTP ${status}).`
  );
};

/**
 * Sanitizes and normalizes an APOD API response item into the screen-facing ApodItem model.
 *
 * Direct image URL resolution:
 * - In science.nasa.gov, `hdurl` contains the direct high-res image URL.
 * - `url` points to an article webpage, so `hdurl` (or fallback) is mapped to `item.url`.
 * - The original article URL is preserved under `permalink` and `article_url`.
 */
export const sanitizeApodItem = (raw: Partial<NasaApodBasicRecord>): ApodItem => {
  const attribution = cleanAttribution(raw.copyright || raw.credit);
  const explanation = cleanExplanation(raw.explanation);
  const mediaType = raw.media_type || 'image';

  const directImage = raw.hdurl || raw.thumbnail_url || FALLBACK_IMAGE_URL;

  return {
    date: raw.date || new Date().toISOString().split('T')[0],
    title: raw.title?.trim() || 'Astronomy Picture of the Day',
    explanation,
    media_type: mediaType,
    url: directImage,
    hdurl: raw.hdurl,
    permalink: raw.permalink || raw.url,
    article_url: raw.permalink || raw.url,
    copyright: attribution,
    credit: attribution,
    service_version: 'v2-basic',
    thumbnail_url: raw.thumbnail_url,
    alt: raw.alt,
  };
};

export const nasaApi = {
  /**
   * Fetches the current day's Astronomy Picture of the Day from the science.nasa.gov endpoint.
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
    const endpoint = `${NASA_APOD_BASE_URL}?api_key=${encodeURIComponent(apiKey)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal,
      });

      const contentType = response.headers.get('content-type') || 'unknown';
      const rawText = await response.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `NASA server returned an invalid non-JSON response (HTTP ${response.status}, ${contentType}).`
        );
      }

      if (!response.ok) {
        throw new Error(parseNasaApiError(response.status, data));
      }

      // Handle array response from the science.nasa.gov endpoint
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object' && (data as any).title) {
          const item = sanitizeApodItem(data as any);
          apodCache.setToday(item);
          return item;
        }
        throw new Error('Unexpected NASA API response format. Expected an array of APOD records.');
      }

      if (data.length === 0) {
        throw new Error('NASA APOD service returned an empty catalog.');
      }

      // Pre-cache all valid records from the array
      for (const record of data) {
        if (record && record.date) {
          const sanitized = sanitizeApodItem(record);
          apodCache.set(record.date, sanitized);
        }
      }

      // Identify the latest record by date (descending)
      const latestRecord = selectLatestApodRecord(data);
      const item = sanitizeApodItem(latestRecord);
      apodCache.setToday(item);
      return item;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      if (
        error instanceof TypeError &&
        (error.message?.includes('Network') || error.message?.includes('fetch failed'))
      ) {
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
