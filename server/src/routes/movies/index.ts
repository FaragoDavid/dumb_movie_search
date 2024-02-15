import { FastifyInstance } from "fastify";
import getMovies from "./get-movies";

export const moviesRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/movies", getMovies);
};
