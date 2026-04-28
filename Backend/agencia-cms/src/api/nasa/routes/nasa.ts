export default {
  routes: [
    {
      method: 'GET',
      path: '/nasa/health',
      handler: 'nasa.health',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/nasa/apod',
      handler: 'nasa.apod',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/nasa/apod-range',
      handler: 'nasa.apodRange',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/nasa/asteroids/feed',
      handler: 'nasa.asteroidsFeed',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/nasa/asteroids/:id',
      handler: 'nasa.asteroidById',
      config: {
        auth: false,
      },
    },
  ],
};
