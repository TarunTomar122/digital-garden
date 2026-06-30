import { Redis } from "@upstash/redis";

const CACHE_KEY = "resume:generated:v3";
const CACHE_TTL_SECONDS = 60 * 60 * 24;

export type CachedResume = {
  html: string;
  generatedAt: string;
  model: string;
};

let memoryCache: { value: CachedResume; expiresAt: number } | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return Redis.fromEnv();
}

function getMemoryCache(): CachedResume | null {
  if (!memoryCache || Date.now() > memoryCache.expiresAt) {
    memoryCache = null;
    return null;
  }
  return memoryCache.value;
}

function setMemoryCache(resume: CachedResume): void {
  memoryCache = {
    value: resume,
    expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
  };
}

export async function getCachedResume(): Promise<CachedResume | null> {
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get<CachedResume>(CACHE_KEY);
      if (cached) return cached;
    } catch {
      // Fall through to memory cache.
    }
  }
  return getMemoryCache();
}

export async function setCachedResume(resume: CachedResume): Promise<void> {
  setMemoryCache(resume);

  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(CACHE_KEY, resume, { ex: CACHE_TTL_SECONDS });
  } catch {
    // Memory cache already set.
  }
}

export async function clearCachedResume(): Promise<void> {
  memoryCache = null;

  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(CACHE_KEY);
  } catch {
    // Ignore cache clear failures.
  }
}