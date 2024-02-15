import config from "../config";
import { createClient } from "redis";

export default class RedisClient {
  private static instance: RedisClient | undefined;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    this.client = createClient({ url: config.redisUrl });
    this.client.on("error", (e) => console.error(e));
  }

  static async getClient() {
    if (!this.instance) {
      this.instance = new RedisClient();
      await this.instance.client.connect();
    }

    return this.instance.client;
  }
}
