/**
 * NASA Astronomy Picture of the Day (APOD) Data Models
 * Supports both legacy planetary API and current science.nasa.gov WordPress REST endpoint.
 */

export type ApodMediaType = 'image' | 'video';

/**
 * Raw APOD record format returned by NASA science.nasa.gov WordPress REST endpoint:
 * https://science.nasa.gov/wp-json/wp/v2/apod-basic/
 */
export interface NasaApodBasicRecord {
  date: string;
  post_id?: number | string;
  title: string;
  permalink?: string;
  media_type: ApodMediaType | string;
  explanation?: string;
  credit?: string;
  copyright?: string;
  alt?: string;
  url?: string; // Note: In the new endpoint, this is an article/page URL, NOT an image URL!
  hdurl?: string; // Direct high-resolution image URL
  thumbnail_url?: string;
  basic_html?: string;
  basic_html_url?: string;
}

/**
 * Screen-facing normalized APOD data item used across ASTRION UI.
 * Guaranteed to provide direct image URLs for React Native Image components.
 */
export interface ApodItem {
  date: string;
  title: string;
  explanation: string;
  media_type: ApodMediaType | string;
  url: string; // Guaranteed direct image URL (from hdurl or safe fallback)
  hdurl?: string; // Direct high-resolution image URL
  permalink?: string; // Article / story web link on science.nasa.gov
  article_url?: string; // Web article link
  copyright?: string; // Cleaned plain-text attribution
  credit?: string; // Cleaned plain-text credit
  thumbnail_url?: string;
  service_version?: string;
  alt?: string;
}

export interface ApodState {
  data: ApodItem | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApodApiError {
  error?: {
    code: string;
    message: string;
  };
  msg?: string;
  code?: number;
  message?: string;
}
