import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting — plan-review fix: NEVER key on a client-supplied id alone
 * (rotation defeats it). Key on IP (first x-forwarded-for hop) with an optional
 * composite for finer per-session limits.
 *
 * Backend: Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (serverless —
 * required because instances share no memory); otherwise an in-memory sliding
 * window (dev / single-instance only, documented limitation).
 */

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() ?? "unknown";
}

export function compositeKey(ip: string, sessionId: string): string {
  return `${ip}:${sessionId}`;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

/** In-memory sliding window — dev fallback, per-process only. */
export class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly now: () => number = () => Date.now()
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const t = this.now();
    const windowStart = t - this.windowMs;
    const arr = (this.hits.get(key) ?? []).filter((ts) => ts > windowStart);

    if (arr.length >= this.max) {
      const oldest = arr[0] ?? t;
      this.hits.set(key, arr);
      return {
        success: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + this.windowMs - t) / 1000)),
      };
    }

    arr.push(t);
    this.hits.set(key, arr);
    if (this.hits.size > 10_000) this.gc(t);
    return { success: true, remaining: this.max - arr.length, retryAfterSeconds: 0 };
  }

  /** Drop empty keys so the map cannot grow without bound. */
  private gc(t: number) {
    for (const [k, v] of this.hits) {
      const alive = v.filter((ts) => ts > t - this.windowMs);
      if (alive.length === 0) this.hits.delete(k);
      else this.hits.set(k, alive);
    }
  }
}

function upstash(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function buildLimiter(max: number, windowMs: number, prefix: string): RateLimiter {
  const redis = upstash();
  if (redis) {
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
      prefix,
    });
    return {
      limit: async (key) => {
        const r = await rl.limit(key);
        return {
          success: r.success,
          remaining: r.remaining,
          retryAfterSeconds: Math.ceil((r.reset - Date.now()) / 1000),
        };
      },
    };
  }
  return new MemoryRateLimiter(max, windowMs);
}

export const limiters = {
  /** Contact form — P2.T6 */
  contact: buildLimiter(5, 10 * 60_000, "rl:contact"),
  /** Reserved for Phase 5 (chat) — plan §8.3 values */
  chatIp: buildLimiter(60, 10 * 60_000, "rl:chat:ip"),
  chatSession: buildLimiter(20, 10 * 60_000, "rl:chat:sess"),
  jobFitIp: buildLimiter(10, 10 * 60_000, "rl:jobfit:ip"),
  jobFitSession: buildLimiter(5, 10 * 60_000, "rl:jobfit:sess"),
};
