export default {
  jwtSecret: process.env.JWT_SECRET as string,
  cache: {
    redisUrl: process.env.REDIS_URL as string,
    expireSeconds: Number(process.env.CACHE_EXPIRE_SECONDS)
  },
  corsOrigin: process.env.CORS as string,
  movieDb: {
    accessToken: process.env.MOVIE_DB_API_READ_ACCESS_TOKEN as string,
    configurationUrl: 'https://api.themoviedb.org/3/configuration',
    movieSearchUrl: 'https://api.themoviedb.org/3/search/movie',
  },
};
