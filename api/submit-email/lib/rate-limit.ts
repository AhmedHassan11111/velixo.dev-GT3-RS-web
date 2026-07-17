import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 60 * 1000,
  maxAttempts: 5,
};

export class RateLimiter {
  constructor(private config: RateLimitConfig = DEFAULT_CONFIG) {}

  async check(ip: string): Promise<RateLimitResult> {
    const key = `rate-limit:${ip}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      await redis.zremrangebyscore(key, 0, windowStart);
      const count = await redis.zcard(key);

      if (count >= this.config.maxAttempts) {
        const oldest = await redis.zrange(key, 0, 0, { withScores: true }) as Array<{ member: string; score: number }>;
        const resetAt = oldest?.[0]?.score
          ? new Date(Number(oldest[0].score) + this.config.windowMs)
          : new Date(now + this.config.windowMs);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
        };
      }

      await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
      await redis.expire(key, Math.ceil(this.config.windowMs / 1000));

      return {
        allowed: true,
        remaining: Math.max(0, this.config.maxAttempts - count - 1),
        resetAt: new Date(now + this.config.windowMs),
      };
    } catch {
      return {
        allowed: true,
        remaining: this.config.maxAttempts,
        resetAt: new Date(now + this.config.windowMs),
      };
    }
  }
}

export const rateLimiter = new RateLimiter();
