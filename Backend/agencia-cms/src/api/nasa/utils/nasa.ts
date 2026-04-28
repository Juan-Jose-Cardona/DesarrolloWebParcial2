const NASA_BASE_URL = 'https://api.nasa.gov';
const DEFAULT_TIMEOUT_MS = 15000;

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

const buildQueryString = (params: QueryParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

export const getNasaApiKey = () => process.env.NASA_API_KEY || 'DEMO_KEY';

export const buildNasaUrl = (path: string, params: QueryParams = {}) => {
  const query = buildQueryString({ ...params, api_key: getNasaApiKey() });
  return `${NASA_BASE_URL}${path}${query ? `?${query}` : ''}`;
};

export const fetchFromNasa = async <T>(path: string, params: QueryParams = {}): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(buildNasaUrl(path, params), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`NASA API error ${response.status}: ${text || response.statusText}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
};

export const normalizeMediaType = (mediaType?: string) => {
  if (mediaType === 'video') return 'video';
  return 'image';
};

export const clampPositiveInteger = (value: unknown, fallback: number, max?: number) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  if (typeof max === 'number') {
    return Math.min(parsed, max);
  }

  return parsed;
};

export const isIsoDate = (value?: string) => {
  if (!value) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

export const daysBetweenInclusive = (startDate: string, endDate: string) => {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
};
