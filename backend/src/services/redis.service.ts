import Redis from "ioredis";
import { env } from "../constants/env";

let redis: Redis;

export const redisKeys = {
  session: (sessionId: string) => `rt:${sessionId}`,
  otpEmail: (purpose: string, email: string) => `otp:${purpose}:email:${email}`,
  otpPhone: (purpose: string, phone: string) => `otp:${purpose}:phone:${phone}`,
  passwordReset: (email: string) => `pwdreset:${email}`,
  rateLimit: (policyName: string, actor: string) => `rl:${policyName}:${actor}`,
  captchaPassed: (policyName: string, actor: string) =>
    `captcha:passed:${policyName}:${actor}`,
} as const;

class RedisService {
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

  /**
   * Hàm lưu giá trị vào redis
   * @param key
   * @param value
   * @param ttlSeconds
   */
  public async setValue<T>(key: string, value: T, ttlSeconds: number | null) {
    const data = JSON.stringify(value);
    if (ttlSeconds === null) await this.client.set(key, data);
    else await this.client.set(key, data, "EX", ttlSeconds);
  }

  /**
   * Hàm lấy dữ liệu đã lưu trong redis
   * @param key
   * @returns Dữ liệu đã lưu, parse theo T
   */
  public async getValue<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  /**
   * Hàm xóa dữ liệu theo key trong redis
   * @param key
   */
  public async deleteKey(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Hàm tăng biến (+1) đếm theo key trong redis, nếu không tồn tại, sẽ tạo với đếm bằng 1
   * @param key
   * @returns Giá trị đếm sau khi tăng
   */
  public async incrementKey(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Hàm đặt thời gian sống theo key
   * @param key
   * @param ttlMilliseconds
   */
  public async pexpireKey(key: string, ttlMilliseconds: number): Promise<void> {
    await this.client.pexpire(key, ttlMilliseconds);
  }

  /**
   * Hàm lấy thời gian sống còn lại của key
   * @param key
   * @returns Thời gian sống còn lại (miliseconds)
   */
  public async pttlKey(key: string): Promise<number> {
    return this.client.pttl(key);
  }

  /**
   * Hàm kiểm tra key tồn tại
   * @param key
   * @returns
   */
  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}

export default new RedisService();
