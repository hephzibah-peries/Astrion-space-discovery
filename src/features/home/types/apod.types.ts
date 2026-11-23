/**
 * NASA Astronomy Picture of the Day (APOD) Data Models
 */

export type ApodMediaType = 'image' | 'video';

export interface ApodItem {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: ApodMediaType | string;
  service_version?: string;
  title: string;
  url: string;
  copyright?: string;
  thumbnail_url?: string;
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
}
