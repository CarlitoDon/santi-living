import type { Store } from "whatsapp-web.js";
import Redis from "ioredis";
import fs from "fs";

export class RedisStore implements Store {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async sessionExists(options: { session: string }): Promise<boolean> {
    const exists = await this.redis.exists(`wwebjs:${options.session}`);
    console.log(
      `🔍 Checking session: ${options.session} - Exists: ${exists === 1}`
    );
    return exists === 1;
  }

  async save(options: { session: string }): Promise<void> {
    const filePath = `${options.session}.zip`;
    if (fs.existsSync(filePath)) {
      console.log(`💾 Saving session to Redis: ${options.session}`);
      const data = await fs.promises.readFile(filePath);
      await this.redis.set(`wwebjs:${options.session}`, data);
      console.log(`✅ Session saved: ${options.session}`);
    } else {
      console.log(`⚠️ Session zip not found: ${filePath}`);
    }
  }

  async extract(options: { session: string; path: string }): Promise<void> {
    console.log(`📂 Extracting session from Redis: ${options.session}`);
    const data = await this.redis.getBuffer(`wwebjs:${options.session}`);
    if (data) {
      await fs.promises.writeFile(options.path, data);
      console.log(`✅ Session extracted to: ${options.path}`);
    } else {
      console.log(`⚠️ No session data found in Redis for: ${options.session}`);
    }
  }

  async delete(options: { session: string }): Promise<void> {
    console.log(`🗑️ Deleting session from Redis: ${options.session}`);
    await this.redis.del(`wwebjs:${options.session}`);
  }
}
