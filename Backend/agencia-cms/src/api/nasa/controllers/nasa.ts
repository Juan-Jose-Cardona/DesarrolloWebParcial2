const toStatusCode = (errorMessage: string) => {
  if (errorMessage.includes('required') || errorMessage.includes('format') || errorMessage.includes('maximum') || errorMessage.includes('cannot be later')) {
    return 400;
  }

  if (errorMessage.includes('NASA API error')) {
    return 502;
  }

  return 500;
};

const buildErrorPayload = (message: string) => ({
  error: true,
  message,
  timestamp: new Date().toISOString(),
});

export default {
  async health(ctx) {
    ctx.send({
      ok: true,
      service: 'nasa-backend',
      endpoints: [
        '/api/nasa/health',
        '/api/nasa/apod',
        '/api/nasa/apod-range',
        '/api/nasa/asteroids/feed',
        '/api/nasa/asteroids/:id',
      ],
      timestamp: new Date().toISOString(),
    });
  },

  async apod(ctx) {
    try {
      const { date } = ctx.query;
      const payload = await strapi.service('api::nasa.nasa').getApod(typeof date === 'string' ? date : undefined);
      ctx.send(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected APOD error.';
      ctx.status = toStatusCode(message);
      ctx.send(buildErrorPayload(message));
    }
  },

  async apodRange(ctx) {
    try {
      const { start_date: startDate, end_date: endDate, count } = ctx.query;
      const payload = await strapi
        .service('api::nasa.nasa')
        .getApodRange(
          typeof startDate === 'string' ? startDate : undefined,
          typeof endDate === 'string' ? endDate : undefined,
          count,
        );

      ctx.send(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected APOD range error.';
      ctx.status = toStatusCode(message);
      ctx.send(buildErrorPayload(message));
    }
  },

  async asteroidsFeed(ctx) {
    try {
      const { start_date: startDate, end_date: endDate } = ctx.query;
      const payload = await strapi
        .service('api::nasa.nasa')
        .getAsteroidsFeed(typeof startDate === 'string' ? startDate : undefined, typeof endDate === 'string' ? endDate : undefined);

      ctx.send(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected asteroids feed error.';
      ctx.status = toStatusCode(message);
      ctx.send(buildErrorPayload(message));
    }
  },

  async asteroidById(ctx) {
    try {
      const { id } = ctx.params;
      const payload = await strapi.service('api::nasa.nasa').getAsteroidById(id);
      ctx.send(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected asteroid lookup error.';
      ctx.status = toStatusCode(message);
      ctx.send(buildErrorPayload(message));
    }
  },
};
