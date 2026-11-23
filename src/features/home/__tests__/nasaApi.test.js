const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Re-implement or import the service logic to test in Node environment
const DEFAULT_NASA_KEY = 'DEMO_KEY';

function getNasaApiKey(envVal) {
  if (envVal && envVal.trim() !== '') {
    return envVal.trim();
  }
  return DEFAULT_NASA_KEY;
}

function parseNasaApiError(status, data) {
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
}

function sanitizeApodItem(raw) {
  return {
    date: raw.date || '2026-11-23',
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
}

class ApodCache {
  constructor() {
    this.cache = new Map();
    this.todayApod = null;
    this.lastFetchedTime = 0;
    this.CACHE_TTL_MS = 15 * 60 * 1000;
  }

  setToday(item) {
    this.todayApod = item;
    this.lastFetchedTime = Date.now();
    this.cache.set('today', item);
    this.cache.set(item.date, item);
  }

  getToday() {
    if (!this.todayApod) return null;
    const isExpired = Date.now() - this.lastFetchedTime > this.CACHE_TTL_MS;
    if (isExpired) return null;
    return this.todayApod;
  }

  set(id, item) {
    this.cache.set(id, item);
    this.cache.set(item.date, item);
  }

  get(id) {
    if (id === 'today' || id === 'apod-today') {
      return this.todayApod || this.cache.get('today');
    }
    return this.cache.get(id);
  }

  clear() {
    this.cache.clear();
    this.todayApod = null;
    this.lastFetchedTime = 0;
  }
}

describe('NASA APOD API Service & Models', () => {
  it('should fall back to DEMO_KEY when environment variable is not defined or empty', () => {
    assert.strictEqual(getNasaApiKey(undefined), 'DEMO_KEY');
    assert.strictEqual(getNasaApiKey(''), 'DEMO_KEY');
    assert.strictEqual(getNasaApiKey('   '), 'DEMO_KEY');
  });

  it('should use custom NASA API key when provided in environment', () => {
    assert.strictEqual(getNasaApiKey('CUSTOM_KEY_123'), 'CUSTOM_KEY_123');
    assert.strictEqual(getNasaApiKey('  SPACEX_KEY  '), 'SPACEX_KEY');
  });

  it('should correctly parse 403 API key forbidden error with helpful advice', () => {
    const errorMsg = parseNasaApiError(403, {
      error: { message: 'An invalid api_key was supplied.' },
    });
    assert.match(errorMsg, /invalid api_key/i);
  });

  it('should correctly parse 429 rate limit error with DEMO_KEY explanation', () => {
    const errorMsg = parseNasaApiError(429, {});
    assert.match(errorMsg, /rate limit exceeded/i);
    assert.match(errorMsg, /EXPO_PUBLIC_NASA_API_KEY/);
  });

  it('should correctly parse 500 server error', () => {
    const errorMsg = parseNasaApiError(500, {});
    assert.match(errorMsg, /planetary servers/i);
  });

  it('should sanitize APOD response with complete data', () => {
    const raw = {
      date: '2026-11-23',
      title: 'NGC 3324 Cosmic Cliffs',
      explanation: 'Detailed astrophysical description.',
      media_type: 'image',
      url: 'https://example.com/image.jpg',
      hdurl: 'https://example.com/image-hd.jpg',
      copyright: 'NASA / ESA / CSA\n',
    };
    const sanitized = sanitizeApodItem(raw);
    assert.strictEqual(sanitized.title, 'NGC 3324 Cosmic Cliffs');
    assert.strictEqual(sanitized.copyright, 'NASA / ESA / CSA');
    assert.strictEqual(sanitized.media_type, 'image');
    assert.strictEqual(sanitized.hdurl, 'https://example.com/image-hd.jpg');
  });

  it('should sanitize APOD response with missing optional fields safely', () => {
    const raw = {
      title: 'Mystery Nebula',
    };
    const sanitized = sanitizeApodItem(raw);
    assert.strictEqual(sanitized.title, 'Mystery Nebula');
    assert.strictEqual(sanitized.copyright, undefined);
    assert.strictEqual(sanitized.media_type, 'image');
    assert.ok(sanitized.url);
    assert.ok(sanitized.explanation);
  });

  it('should handle video media_type and thumbnail_url gracefully', () => {
    const raw = {
      date: '2026-11-23',
      title: 'Journey Through Orion Video',
      media_type: 'video',
      url: 'https://youtube.com/watch?v=123',
      thumbnail_url: 'https://img.youtube.com/vi/123/hqdefault.jpg',
    };
    const sanitized = sanitizeApodItem(raw);
    assert.strictEqual(sanitized.media_type, 'video');
    assert.strictEqual(sanitized.thumbnail_url, 'https://img.youtube.com/vi/123/hqdefault.jpg');
  });
});

describe('APOD In-Memory Cache', () => {
  let cache;

  beforeEach(() => {
    cache = new ApodCache();
  });

  it('should store and retrieve today APOD item', () => {
    const item = { date: '2026-11-23', title: 'Test Star', url: 'https://star.jpg' };
    cache.setToday(item);

    const retrieved = cache.getToday();
    assert.deepStrictEqual(retrieved, item);

    const retrievedById = cache.get('today');
    assert.deepStrictEqual(retrievedById, item);

    const retrievedByDate = cache.get('2026-11-23');
    assert.deepStrictEqual(retrievedByDate, item);
  });

  it('should return null when cache is empty', () => {
    assert.strictEqual(cache.getToday(), null);
    assert.strictEqual(cache.get('unknown-date'), undefined);
  });

  it('should clear cached items', () => {
    const item = { date: '2026-11-23', title: 'Test Star' };
    cache.setToday(item);
    cache.clear();
    assert.strictEqual(cache.getToday(), null);
  });
});
