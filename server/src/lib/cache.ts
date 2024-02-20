import config from "../config";
import { createClient } from "redis";

export default class Cache {
  static instance: Cache | undefined;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    this.client = createClient({ url: config.cache.redisUrl });
    this.client.on('error', (e) => console.error(e));
  }

  static async getClient() {
    if (!this.instance) {
      this.instance = new Cache();
      await this.instance.client.connect();
    }

    return this.instance.client;
  }
}
