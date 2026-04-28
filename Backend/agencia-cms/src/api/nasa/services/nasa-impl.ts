import { fetchFromNasa, clampPositiveInteger, daysBetweenInclusive, isIsoDate, normalizeMediaType } from '../utils/nasa';

type ApodResponse = {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type?: string;
  copyright?: string;
  service_version?: string;
  thumbnail_url?: string;
};

type NeoFeedItem = {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url?: string;
  absolute_magnitude_h?: number;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: {
    meters?: {
      estimated_diameter_min?: number;
      estimated_diameter_max?: number;
    };
    kilometers?: {
      estimated_diameter_min?: number;
      estimated_diameter_max?: number;
    };
  };
  close_approach_data?: Array<{
    close_approach_date?: string;
    relative_velocity?: {
      kilometers_per_hour?: string;
    };
    miss_distance?: {
      kilometers?: string;
      lunar?: string;
    };
    orbiting_body?: string;
  }>;
};

type NeoFeedResponse = {
  element_count: number;
  near_earth_objects: Record<string, NeoFeedItem[]>;
};

type NeoLookupResponse = NeoFeedItem & {
  is_sentry_object?: boolean;
};

const APOD_PATH = '/planetary/apod';
const NEO_FEED_PATH = '/neo/rest/v1/feed';
const NEO_LOOKUP_PATH = '/neo/rest/v1/neo';

const normalizeApod = (item: ApodResponse) => ({
  date: item.date,
  title: item.title,
  explanation: item.explanation,
  mediaType: normalizeMediaType(item.media_type),
  imageUrl: item.url,
  hdImageUrl: item.hdurl || item.url,
  thumbnailUrl: item.thumbnail_url || item.url,
  copyright: item.copyright || null,
  serviceVersion: item.service_version || null,
});

const normalizeAsteroid = (asteroid: NeoFeedItem) => {
  const firstApproach = asteroid.close_approach_data?.[0];

  return {
    id: asteroid.id,
    neoReferenceId: asteroid.neo_reference_id,
    name: asteroid.name,
    nasaJplUrl: asteroid.nasa_jpl_url || null,
    absoluteMagnitudeH: asteroid.absolute_magnitude_h ?? null,
    isPotentiallyHazardous: Boolean(asteroid.is_potentially_hazardous_asteroid),
    estimatedDiameter: {
      meters: {
        min: asteroid.estimated_diameter?.meters?.estimated_diameter_min ?? null,
        max: asteroid.estimated_diameter?.meters?.estimated_diameter_max ?? null,
      },
      kilometers: {
        min: asteroid.estimated_diameter?.kilometers?.estimated_diameter_min ?? null,
        max: asteroid.estimated_diameter?.kilometers?.estimated_diameter_max ?? null,
      },
    },
    closeApproach: firstApproach
      ? {
          date: firstApproach.close_approach_date || null,
          velocityKmH: firstApproach.relative_velocity?.kilometers_per_hour ?? null,
          missDistanceKm: firstApproach.miss_distance?.kilometers ?? null,
          missDistanceLunar: firstApproach.miss_distance?.lunar ?? null,
          orbitingBody: firstApproach.orbiting_body || null,
        }
      : null,
  };
};

const flattenFeed = (feed: Record<string, NeoFeedItem[]>) =>
  Object.entries(feed)
    .flatMap(([date, asteroids]) => asteroids.map((asteroid) => ({ date, ...normalizeAsteroid(asteroid) })))
    .sort((a, b) => a.date.localeCompare(b.date));

export default {
  async getApod(date?: string) {
    if (date && !isIsoDate(date)) {
      throw new Error('The APOD date must use YYYY-MM-DD format.');
    }

    const data = await fetchFromNasa<ApodResponse>(APOD_PATH, {
      date,
      thumbs: true,
    });

    return {
      source: 'NASA APOD',
      item: normalizeApod(data),
    };
  },

  async getApodRange(startDate?: string, endDate?: string, count?: unknown) {
    const safeCount = clampPositiveInteger(count, 6, 20);

    if (count && !startDate && !endDate) {
      const data = await fetchFromNasa<ApodResponse[]>(APOD_PATH, {
        count: safeCount,
        thumbs: true,
      });

      return {
        source: 'NASA APOD',
        total: data.length,
        items: data.map(normalizeApod).sort((a, b) => b.date.localeCompare(a.date)),
      };
    }

    if (!startDate || !endDate || !isIsoDate(startDate) || !isIsoDate(endDate)) {
      throw new Error('start_date and end_date are required in YYYY-MM-DD format.');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('start_date cannot be later than end_date.');
    }

    const totalDays = daysBetweenInclusive(startDate, endDate);
    if (totalDays > 20) {
      throw new Error('For APOD range requests, use a maximum span of 20 days.');
    }

    const data = await fetchFromNasa<ApodResponse[]>(APOD_PATH, {
      start_date: startDate,
      end_date: endDate,
      thumbs: true,
    });

    return {
      source: 'NASA APOD',
      total: data.length,
      items: data.map(normalizeApod).sort((a, b) => b.date.localeCompare(a.date)),
    };
  },

  async getAsteroidsFeed(startDate?: string, endDate?: string) {
    if (!startDate || !endDate || !isIsoDate(startDate) || !isIsoDate(endDate)) {
      throw new Error('start_date and end_date are required in YYYY-MM-DD format.');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('start_date cannot be later than end_date.');
    }

    const totalDays = daysBetweenInclusive(startDate, endDate);
    if (totalDays > 7) {
      throw new Error('NeoWs feed supports a maximum range of 7 days.');
    }

    const data = await fetchFromNasa<NeoFeedResponse>(NEO_FEED_PATH, {
      start_date: startDate,
      end_date: endDate,
    });

    const items = flattenFeed(data.near_earth_objects || {});

    return {
      source: 'NASA NeoWs',
      startDate,
      endDate,
      total: data.element_count,
      hazardousCount: items.filter((item) => item.isPotentiallyHazardous).length,
      items,
    };
  },

  async getAsteroidById(id?: string) {
    if (!id) {
      throw new Error('Asteroid id is required.');
    }

    const data = await fetchFromNasa<NeoLookupResponse>(`${NEO_LOOKUP_PATH}/${id}`);

    return {
      source: 'NASA NeoWs',
      item: {
        ...normalizeAsteroid(data),
        isSentryObject: Boolean(data.is_sentry_object),
      },
    };
  },
};
