import Redis from "ioredis";
import { env } from "../constants/env";

let redis: Redis;

class RedisClient {
  private client: Redis;

  constructor() {
    this.client = this.getRedisClient();
  }

  private getRedisClient() {
    if (!redis) {
      redis = new Redis(env.REDIS_URL, {
        retryStrategy: (times) => Math.min(times * 50, 2000), // reconnect delay
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });

      redis.on("connect", () => console.log("Redis connected"));
      redis.on("error", (err) => console.error("Redis error:", err));
    }
    return redis;
  }

  public async setValue<T>(key: string, value: T, ttlSeconds?: number) {
    const data = JSON.stringify(value);
    if (ttlSeconds) await this.client.set(key, data, "EX", ttlSeconds);
    else await this.client.set(key, data);
  }

  public async getValue<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  public async deleteKey(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export const redisKeys = {
  refreshToken: (userId: number) => `refreshToken:user:${userId}`,
  otpEmail: (email: string) => `otp:email:${email}`,
  otpPhone: (phone: string) => `otp:phone:${phone}`,
} as const;

export default new RedisClient();
