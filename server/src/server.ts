import * as dotenv from "dotenv";
dotenv.config();

import server from "./app";
import RedisClient from "./lib/cache";

const disconnect = async () => {
  await (await RedisClient.getClient()).disconnect();
};

process.on("SIGINT", disconnect);
process.on("SIGTERM", disconnect);

server({ logger: process.env.FASTIFY_LOGGER_ENABLED === "true" }).listen(
  { port: 8080, host: "::" },
  (err, address) => {
    console.log(`App is listening on ${address}`);

    if (err) {
      console.log(err);
      process.exit(1);
    }
  }
);
