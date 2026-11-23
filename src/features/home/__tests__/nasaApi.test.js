const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Service constants & logic matching src/features/home/services/nasaApi.ts
const DEFAULT_NASA_KEY = 'DEMO_KEY';
const FALLBACK_IMAGE_URL =
  'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png';

function getNasaApiKey(envVal) {
  if (envVal && envVal.trim() !== '') {
    return envVal.trim();
  }
  return DEFAULT_NASA_KEY;
}

function decodeHtmlEntities(str) {
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
}

function stripHtml(html) {
  if (!html) return '';
  const noTags = html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '');
  const decoded = decodeHtmlEntities(noTags);
  return decoded.replace(/[ \t]+/g, ' ').trim();
}

function cleanAttribution(raw) {
  if (!raw) return undefined;
  const stripped = stripHtml(raw);
  const normalized = stripped.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  return normalized.length > 0 ? normalized : undefined;
}

function cleanExplanation(raw) {
  if (!raw) {
    return 'No scientific explanation was provided by NASA for this astronomical feature.';
  }
  let text = stripHtml(raw);
  text = text.replace(/^Explanation:\s*/i, '').trim();
  text = text.replace(/Tomorrow's picture:.*$/i, '').trim();
  return text.length > 0
    ? text
    : 'No scientific explanation was provided by NASA for this astronomical feature.';
}

function selectLatestApodRecord(records) {
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
}

function parseNasaApiError(status, data) {
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
}

function sanitizeApodItem(raw) {
  const attribution = cleanAttribution(raw.copyright || raw.credit);
  const explanation = cleanExplanation(raw.explanation);
  const mediaType = raw.media_type || 'image';

  // Direct image URL resolution: prioritize hdurl, then thumbnail_url, then fallback placeholder.
  // Never use raw.url as an image source because in science.nasa.gov it points to an HTML article.
  const directImage = raw.hdurl || raw.thumbnail_url || FALLBACK_IMAGE_URL;

  return {
    date: raw.date || '2026-11-23',
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
    this.cache.set('apod-today', item);
    this.cache.set(item.date, item);
    this.cache.set(`apod-${item.date}`, item);
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
    this.cache.set(`apod-${item.date}`, item);
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

describe('NASA APOD API Service & Models (science.nasa.gov Integration)', () => {
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
    assert.match(errorMsg, /invalid/i);
    assert.strictEqual(
      parseNasaApiError(403, {}),
      'Invalid or unauthorized NASA API key. Check your EXPO_PUBLIC_NASA_API_KEY configuration.'
    );
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

  it('should correctly select the latest record by date from an unsorted array of records', () => {
    const records = [
      { date: '2026-11-20', title: 'Older Record' },
      { date: '2026-11-23', title: 'Latest Today Record' },
      { date: '2026-11-21', title: 'Middle Record' },
      { date: '2026-11-19', title: 'Oldest Record' },
    ];
    const latest = selectLatestApodRecord(records);
    assert.strictEqual(latest.date, '2026-11-23');
    assert.strictEqual(latest.title, 'Latest Today Record');
  });

  it('should throw meaningful error when API returns an empty array or invalid records', () => {
    assert.throws(
      () => selectLatestApodRecord([]),
      /NASA APOD service returned an empty catalog/i
    );
    assert.throws(
      () => selectLatestApodRecord([{ title: 'No Date' }]),
      /returned no records with valid astronomical dates/i
    );
  });

  it('should map hdurl correctly to direct image URL and NOT use raw url (article link) as image', () => {
    const raw = {
      date: '2026-11-23',
      title: 'Dark Nebula Lynds 1251',
      media_type: 'image',
      url: 'https://science.nasa.gov/image-article/apod-2026-november-23-nebula/', // Article web page
      hdurl: 'https://assets.science.nasa.gov/dynamicimage/nebula_2160.jpg', // Direct image URL
      permalink: 'https://science.nasa.gov/image-article/apod-2026-november-23-nebula/',
    };
    const sanitized = sanitizeApodItem(raw);

    // CRITICAL: item.url must be the direct image URL, NOT the article page
    assert.strictEqual(sanitized.url, 'https://assets.science.nasa.gov/dynamicimage/nebula_2160.jpg');
    assert.strictEqual(sanitized.hdurl, 'https://assets.science.nasa.gov/dynamicimage/nebula_2160.jpg');
    assert.notStrictEqual(sanitized.url, raw.url);

    // Article links are preserved
    assert.strictEqual(sanitized.permalink, raw.url);
    assert.strictEqual(sanitized.article_url, raw.url);
  });

  it('should fall back to safe placeholder image when hdurl is missing', () => {
    const raw = {
      date: '2026-11-23',
      title: 'Missing Image APOD',
      url: 'https://science.nasa.gov/article-only',
    };
    const sanitized = sanitizeApodItem(raw);
    assert.strictEqual(sanitized.url, FALLBACK_IMAGE_URL);
    assert.strictEqual(sanitized.hdurl, undefined);
  });

  it('should convert HTML explanation into clean, readable plain text', () => {
    const rawHtml =
      '<strong>Explanation:</strong> What creates the colors in Jupiter\'s clouds? No one is sure. The thick atmosphere of <a href="https://science.nasa.gov/jupiter/">Jupiter</a> is mostly <a href="https://en.wikipedia.org/wiki/Hydrogen">hydrogen</a> and <a href="https://en.wikipedia.org/wiki/Helium">helium</a>.<br><br><strong>Tomorrow\'s picture:</strong> night on a spooky planet';
    const cleaned = cleanExplanation(rawHtml);

    // No raw HTML tags
    assert.doesNotMatch(cleaned, /<[^>]+>/);
    // No leading "Explanation:" label
    assert.doesNotMatch(cleaned, /^Explanation:/i);
    // No trailing tomorrow teaser
    assert.doesNotMatch(cleaned, /Tomorrow's picture/i);
    // Plain text content preserved
    assert.match(cleaned, /What creates the colors in Jupiter's clouds\?/);
    assert.match(cleaned, /mostly hydrogen and helium\./);
  });

  it('should convert HTML copyright and credit links into clean attribution text', () => {
    const rawCopyright = '<a href="https://www.instagram.com/astro.midnight">David Cruz</a>';
    const cleaned = cleanAttribution(rawCopyright);
    assert.strictEqual(cleaned, 'David Cruz');

    const multiCredit =
      '<a href="https://www.nasa.gov/">NASA</a>, <a href="https://science.nasa.gov/mission/juno/">Juno</a>; <em>Processing &amp; <a href="https://creativecommons.org/">License</a>:</em> <a href="...">Matt Brealey</a>, <a href="...">Seán Doran</a>';
    const cleanedMulti = cleanAttribution(multiCredit);
    assert.strictEqual(cleanedMulti, 'NASA, Juno; Processing & License: Matt Brealey, Seán Doran');
  });

  it('should handle whitespace-only, empty, or undefined copyright by returning undefined', () => {
    assert.strictEqual(cleanAttribution('   \n  \t  '), undefined);
    assert.strictEqual(cleanAttribution(''), undefined);
    assert.strictEqual(cleanAttribution(undefined), undefined);
  });

  it('should preserve full exact copyright attribution without truncation', () => {
    const exactCredit = 'Dave Doctor, International Space Observatory & Collaboration Team';
    const raw = { title: 'Deep Field', copyright: `  ${exactCredit}\n\n` };
    const sanitized = sanitizeApodItem(raw);
    assert.strictEqual(sanitized.copyright, exactCredit);
  });

  it('should handle video media_type and thumbnail_url gracefully', () => {
    const raw = {
      date: '2026-11-23',
      title: 'Journey Through Orion Video',
      media_type: 'video',
      url: 'https://science.nasa.gov/video-article',
      thumbnail_url: 'https://assets.science.nasa.gov/video_thumb.jpg',
      permalink: 'https://science.nasa.gov/video-article',
    };
    const sanitized = sanitizeApodItem(raw);
    assert.strictEqual(sanitized.media_type, 'video');
    assert.strictEqual(sanitized.url, 'https://assets.science.nasa.gov/video_thumb.jpg');
    assert.strictEqual(sanitized.thumbnail_url, 'https://assets.science.nasa.gov/video_thumb.jpg');
    assert.strictEqual(sanitized.permalink, 'https://science.nasa.gov/video-article');
  });
});

describe('APOD In-Memory Cache (Array Pre-Caching & TTL)', () => {
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

    const retrievedByApodDate = cache.get('apod-2026-11-23');
    assert.deepStrictEqual(retrievedByApodDate, item);
  });

  it('should pre-cache array records for individual date retrieval in DetailsScreen', () => {
    const item1 = { date: '2026-11-23', title: 'Day 23 Star', url: 'https://star23.jpg' };
    const item2 = { date: '2026-11-22', title: 'Day 22 Galaxy', url: 'https://galaxy22.jpg' };

    cache.set(item1.date, item1);
    cache.set(item2.date, item2);

    assert.deepStrictEqual(cache.get('2026-11-23'), item1);
    assert.deepStrictEqual(cache.get('2026-11-22'), item2);
    assert.deepStrictEqual(cache.get('apod-2026-11-22'), item2);
  });

  it('should return null when cache is empty or unknown key is queried', () => {
    assert.strictEqual(cache.getToday(), null);
    assert.strictEqual(cache.get('unknown-date'), undefined);
  });

  it('should clear cached items', () => {
    const item = { date: '2026-11-23', title: 'Test Star' };
    cache.setToday(item);
    cache.clear();
    assert.strictEqual(cache.getToday(), null);
    assert.strictEqual(cache.get('today'), undefined);
  });
});
