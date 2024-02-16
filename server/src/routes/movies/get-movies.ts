import { FastifyReply, FastifyRequest } from "fastify";
import MovieDatabaseClient from "../../lib/movie-database-client";
import RedisClient from "../../lib/cache";
import config from '../../config';

export default async (request: FastifyRequest<{ Querystring: { query: string } }>, reply: FastifyReply) => {
  const redisClient = await RedisClient.getClient();
  const query = request.query.query;

  if (await redisClient.exists(query)) {
    const cacheResult = JSON.parse((await redisClient.get(query)) || '');

    reply.send(cacheResult);
  } else {
    const apiResult = await new MovieDatabaseClient().fetchMovies(query);

    redisClient.set(query, JSON.stringify(apiResult));

    reply.send(apiResult);
  }
};
