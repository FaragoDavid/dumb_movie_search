import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors';
import fastify from "fastify";
import config from "./config";
import z from "zod";
import { moviesRoutes } from "./routes/movies";

function build(opts = {}) {
  const app = fastify(opts);


  app.register(cors, {
    origin: new RegExp(config.corsOrigin),
  });
  app.register(fastifyJwt, { secret: config.jwtSecret });

  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      reply.status(401).send(e);
    }
  });

  app.register(moviesRoutes, { prefix: "/v1" });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError) {
      reply.status(400).send({ message: error.message });
    } else {
      reply.send(error);
    }
  });

  return app;
}

export default build;
