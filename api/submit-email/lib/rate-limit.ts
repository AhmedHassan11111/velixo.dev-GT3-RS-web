import { Redis } from '@upstash/redis';

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';

if (!upstashUrl || !upstashToken) {
  console.warn('Upstash Redis credentials missing. Rate limiting will be disabled.');
} else if (!upstashUrl.startsWith('https://')) {
  console.error('Invalid UPSTASH_REDIS_REST_URL format. Expected full https:// URL, got:', upstashUrl);
}

const redis = new Redis({
  url: upstashUrl,
  token: upstashToken,
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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeout]);
}

export class RateLimiter {
  constructor(private config: RateLimitConfig = DEFAULT_CONFIG) {}

  async check(ip: string): Promise<RateLimitResult> {
    const key = `rate-limit:${ip}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      await withTimeout(redis.zremrangebyscore(key, 0, windowStart), 5000);
      const count = await withTimeout(redis.zcard(key), 5000);

      if (count >= this.config.maxAttempts) {
        const oldest = await withTimeout(
          redis.zrange(key, 0, 0, { withScores: true }) as Promise<Array<{ member: string; score: number }>>,
          5000
        );
        const resetAt = oldest?.[0]?.score
          ? new Date(Number(oldest[0].score) + this.config.windowMs)
          : new Date(now + this.config.windowMs);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
        };
      }

      await withTimeout(redis.zadd(key, { score: now, member: `${now}-${Math.random()}` }), 5000);
      await withTimeout(redis.expire(key, Math.ceil(this.config.windowMs / 1000)), 5000);

      return {
        allowed: true,
        remaining: Math.max(0, this.config.maxAttempts - count - 1),
        resetAt: new Date(now + this.config.windowMs),
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      return {
        allowed: true,
        remaining: this.config.maxAttempts,
        resetAt: new Date(now + this.config.windowMs),
      };
    }
  }
}

export const rateLimiter = new RateLimiter();
