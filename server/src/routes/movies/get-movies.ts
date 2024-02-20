import { FastifyReply, FastifyRequest } from "fastify";
import MovieDatabaseClient from "../../lib/movie-database-client";
import Cache from '../../lib/cache';
import config from '../../config';

export default async (request: FastifyRequest<{ Querystring: { query: string; page: number } }>, reply: FastifyReply) => {
  const redisClient = await Cache.getClient();
  const { query, page } = request.query;
  const cacheKey = `${query}_${page}`;

  if (await redisClient.exists(cacheKey)) {
    const cacheResult = JSON.parse((await redisClient.get(cacheKey)) || '');

    reply.send(cacheResult);
  } else {
    const apiResult = await new MovieDatabaseClient().fetchMovies(query, page);

    redisClient.set(cacheKey, JSON.stringify(apiResult));
    redisClient.expire(cacheKey, config.cache.expireSeconds);

    reply.send(apiResult);
  }
};
