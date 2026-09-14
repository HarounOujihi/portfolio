import { describe, expect, it } from "vitest";
import { MemoryRateLimiter, compositeKey, getClientIp } from "../rate-limit";

describe("getClientIp", () => {
  it("takes the first x-forwarded-for hop", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.9.9.9" });
    expect(getClientIp(h)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "7.7.7.7" }))).toBe("7.7.7.7");
  });

  it("returns unknown without headers", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("compositeKey", () => {
  it("combines ip and session — rotating session under one IP stays attributable", () => {
    expect(compositeKey("1.2.3.4", "aaa")).toBe("1.2.3.4:aaa");
    expect(compositeKey("1.2.3.4", "bbb")).toBe("1.2.3.4:bbb");
  });
});

describe("MemoryRateLimiter", () => {
  it("allows under the limit and blocks at the limit", async () => {
    const limiter = new MemoryRateLimiter(3, 60_000, () => 0);
    expect((await limiter.limit("k")).success).toBe(true);
    expect((await limiter.limit("k")).success).toBe(true);
    expect((await limiter.limit("k")).success).toBe(true);
    const blocked = await limiter.limit("k");
    expect(blocked.success).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("windows expire — allowed again after windowMs", async () => {
    let t = 0;
    const limiter = new MemoryRateLimiter(1, 10_000, () => t);
    expect((await limiter.limit("k")).success).toBe(true);
    expect((await limiter.limit("k")).success).toBe(false);
    t = 10_001;
    expect((await limiter.limit("k")).success).toBe(true);
  });

  it("keys are independent", async () => {
    const limiter = new MemoryRateLimiter(1, 60_000, () => 0);
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("b")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(false);
  });
});
