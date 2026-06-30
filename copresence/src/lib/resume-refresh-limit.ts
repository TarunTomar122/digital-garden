import { Redis } from "@upstash/redis";

export const MAX_REFRESHES_PER_DAY = 3;
export const MAX_GLOBAL_GENERATIONS_PER_DAY = 50;

const REFRESH_KEY_PREFIX = "resume:refresh:v1";
const GLOBAL_KEY_PREFIX = "resume:global-gen:v1";

type MemoryEntry = { count: number; expiresAt: number };
const memoryLimits = new Map<string, MemoryEntry>();

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return Redis.fromEnv();
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function secondsUntilUtcMidnight(): number {
  const now = new Date();
  const midnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return Math.max(1, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

function refreshLimitKey(ip: string): string {
  return `${REFRESH_KEY_PREFIX}:${todayUtc()}:${ip}`;
}

function globalLimitKey(): string {
  return `${GLOBAL_KEY_PREFIX}:${todayUtc()}`;
}

async function incrementMemory(key: string): Promise<number> {
  const existing = memoryLimits.get(key);
  const ttlMs = secondsUntilUtcMidnight() * 1000;

  if (!existing || Date.now() > existing.expiresAt) {
    memoryLimits.set(key, { count: 1, expiresAt: Date.now() + ttlMs });
    return 1;
  }

  existing.count += 1;
  return existing.count;
}

async function incrementDailyCounter(key: string): Promise<number> {
  const redis = getRedis();
  if (redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, secondsUntilUtcMidnight());
      }
      return count;
    } catch {
      return incrementMemory(key);
    }
  }
  return incrementMemory(key);
}

export type LimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
};

function toLimitResult(count: number, max: number): LimitResult {
  return {
    allowed: count < max,
    remaining: Math.max(0, max - count),
    limit: max,
  };
}

async function getDailyCount(key: string): Promise<number> {
  const redis = getRedis();
  if (redis) {
    try {
      const value = await redis.get<number>(key);
      return typeof value === "number" ? value : 0;
    } catch {
      // Fall through to memory.
    }
  }

  const existing = memoryLimits.get(key);
  if (!existing || Date.now() > existing.expiresAt) return 0;
  return existing.count;
}

export async function peekRefreshLimit(ip: string): Promise<LimitResult> {
  const count = await getDailyCount(refreshLimitKey(ip));
  return toLimitResult(count, MAX_REFRESHES_PER_DAY);
}

export async function peekGlobalGenerationLimit(): Promise<LimitResult> {
  const count = await getDailyCount(globalLimitKey());
  return toLimitResult(count, MAX_GLOBAL_GENERATIONS_PER_DAY);
}

export async function consumeRefreshAttempt(ip: string): Promise<LimitResult> {
  const count = await incrementDailyCounter(refreshLimitKey(ip));
  return {
    allowed: count <= MAX_REFRESHES_PER_DAY,
    remaining: Math.max(0, MAX_REFRESHES_PER_DAY - count),
    limit: MAX_REFRESHES_PER_DAY,
  };
}

export async function consumeGlobalGeneration(): Promise<LimitResult> {
  const count = await incrementDailyCounter(globalLimitKey());
  return {
    allowed: count <= MAX_GLOBAL_GENERATIONS_PER_DAY,
    remaining: Math.max(0, MAX_GLOBAL_GENERATIONS_PER_DAY - count),
    limit: MAX_GLOBAL_GENERATIONS_PER_DAY,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}