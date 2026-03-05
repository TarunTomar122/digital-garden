import { promises as fs } from "node:fs";
import path from "node:path";

const WHOOP_AUTH_BASE = "https://api.prod.whoop.com/oauth/oauth2";
const WHOOP_API_BASE = process.env.WHOOP_API_BASE ?? "https://api.prod.whoop.com/developer";
const TOKEN_FILE = path.join(process.cwd(), ".whoop-tokens.json");

type TokenPayload = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

type StoredWhoopTokens = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

export type WhoopWidgetData =
  | {
      status: "disconnected";
      reason: "missing_config" | "missing_tokens" | "fetch_failed";
      message: string;
    }
  | {
      status: "connected";
      recovery: number | null;
      strain: number | null;
      sleepHours: number | null;
      updatedAt: string | null;
    };

function getClientConfig() {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOOP_REDIRECT_URI;

  return {
    clientId,
    clientSecret,
    redirectUri,
    isConfigured: Boolean(clientId && clientSecret && redirectUri),
  };
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function getPath(obj: Record<string, unknown> | undefined, pathKey: string): unknown {
  if (!obj) return null;
  return pathKey.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return null;
  }, obj);
}

function extractNumber(obj: Record<string, unknown> | undefined, paths: string[]): number | null {
  for (const pathKey of paths) {
    const value = parseNumber(getPath(obj, pathKey));
    if (value !== null) return value;
  }
  return null;
}

function defaultScopes() {
  return "offline read:sleep read:recovery read:workout";
}

export function buildWhoopAuthUrl(state: string) {
  const { clientId, redirectUri } = getClientConfig();
  if (!clientId || !redirectUri) {
    throw new Error("WHOOP client ID or redirect URI is missing.");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: process.env.WHOOP_SCOPES ?? defaultScopes(),
    state,
  });

  return `${WHOOP_AUTH_BASE}/auth?${params.toString()}`;
}

async function writeLocalTokens(tokens: StoredWhoopTokens) {
  await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2), "utf8");
}

async function readLocalTokens(): Promise<StoredWhoopTokens | null> {
  try {
    const raw = await fs.readFile(TOKEN_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoredWhoopTokens;
    return parsed;
  } catch {
    return null;
  }
}

async function getStoredTokens(): Promise<StoredWhoopTokens | null> {
  const envRefreshToken = process.env.WHOOP_REFRESH_TOKEN;
  const envAccessToken = process.env.WHOOP_ACCESS_TOKEN;
  const envExpiresAt = process.env.WHOOP_ACCESS_TOKEN_EXPIRES_AT;

  if (envRefreshToken || envAccessToken) {
    return {
      refreshToken: envRefreshToken,
      accessToken: envAccessToken,
      expiresAt: envExpiresAt ? Number(envExpiresAt) : undefined,
    };
  }

  return readLocalTokens();
}

export async function exchangeCodeForTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getClientConfig();
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("WHOOP client credentials are missing.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  // Use Basic auth for client credentials (OAuth 2.0 standard)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${WHOOP_AUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${basicAuth}`,
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`WHOOP token exchange failed (${response.status}): ${text}`);
  }

  const tokens = (await response.json()) as TokenPayload;
  console.log("[WHOOP] Token exchange response:", {
    hasAccessToken: !!tokens.access_token,
    hasRefreshToken: !!tokens.refresh_token,
    expiresIn: tokens.expires_in,
    scope: tokens.scope,
  });

  const expiresAt = tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined;

  const storedTokens: StoredWhoopTokens = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
  };

  await writeLocalTokens(storedTokens);
  console.log("[WHOOP] Tokens saved, hasRefreshToken:", !!storedTokens.refreshToken);
  return storedTokens;
}

async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret, redirectUri } = getClientConfig();
  if (!clientId || !clientSecret) {
    console.error("[WHOOP] Missing client credentials:", { hasClientId: !!clientId, hasClientSecret: !!clientSecret });
    throw new Error("WHOOP client credentials are missing.");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  // Add redirect_uri if available (WHOOP may require it)
  if (redirectUri) {
    body.set("redirect_uri", redirectUri);
  }

  // Use Basic auth for client credentials (OAuth 2.0 standard)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  console.log("[WHOOP] Refreshing with Basic auth:", {
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken?.length,
    hasRedirectUri: !!redirectUri,
  });

  const response = await fetch(`${WHOOP_AUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${basicAuth}`,
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[WHOOP] Refresh failed:", response.status, text);
    throw new Error(`WHOOP refresh failed (${response.status}): ${text}`);
  }

  const tokens = (await response.json()) as TokenPayload;
  const expiresAt = tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined;
  const nextState: StoredWhoopTokens = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? refreshToken,
    expiresAt,
  };

  if (!process.env.WHOOP_REFRESH_TOKEN) {
    await writeLocalTokens(nextState);
  }

  return nextState;
}

async function getAccessToken(forceRefresh = false) {
  const stored = await getStoredTokens();
  if (!stored) return null;

  const isStillValid = Boolean(
    !forceRefresh &&
    stored.accessToken &&
    stored.expiresAt &&
    stored.expiresAt > Date.now() + 30_000
  );
  if (isStillValid && stored.accessToken) return stored.accessToken;

  if (!stored.refreshToken) {
    return stored.accessToken ?? null;
  }

  try {
    console.log("[WHOOP] Refreshing access token...");
    const refreshed = await refreshAccessToken(stored.refreshToken);
    console.log("[WHOOP] Token refreshed successfully");
    return refreshed.accessToken ?? null;
  } catch (error) {
    console.error("[WHOOP] Token refresh failed:", error);
    return null;
  }
}

async function fetchLatest(endpointCandidates: string[], accessToken: string) {
  let lastError: string | null = null;

  for (const endpoint of endpointCandidates) {
    const response = await fetch(`${WHOOP_API_BASE}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const payload = (await response.json()) as { records?: Array<Record<string, unknown>> };
      return payload.records?.[0] ?? null;
    }

    lastError = `${endpoint} -> ${response.status}`;
    if (response.status !== 404) break;
  }

  if (lastError) {
    throw new Error(lastError);
  }

  return null;
}

export async function getWhoopWidgetData(): Promise<WhoopWidgetData> {
  const { isConfigured } = getClientConfig();
  if (!isConfigured) {
    return {
      status: "disconnected",
      reason: "missing_config",
      message: "Set WHOOP env vars to connect your account.",
    };
  }

  const stored = await getStoredTokens();
  if (!stored?.refreshToken && !stored?.accessToken) {
    return {
      status: "disconnected",
      reason: "missing_tokens",
      message: "Connect WHOOP once to store tokens.",
    };
  }

  // Helper to fetch all data with retry on 401
  async function fetchAllData(forceRefresh = false) {
    const accessToken = await getAccessToken(forceRefresh);
    if (!accessToken) {
      return { error: "no_token" as const };
    }

    const [recoveryRecord, workoutRecord, sleepRecord] = await Promise.all([
      fetchLatest(["/v2/recovery?limit=1"], accessToken),
      fetchLatest(["/v2/activity/workout?limit=1"], accessToken),
      fetchLatest(["/v2/activity/sleep?limit=1", "/v2/sleep?limit=1"], accessToken),
    ]);

    return { recoveryRecord, workoutRecord, sleepRecord };
  }

  try {
    // First attempt
    let result = await fetchAllData(false);

    // If first attempt failed due to 401, retry with fresh token
    if ("error" in result && result.error === "no_token") {
      return {
        status: "disconnected",
        reason: "missing_tokens",
        message: "No WHOOP access token available.",
      };
    }

    const { recoveryRecord, workoutRecord, sleepRecord } = result;

    const recovery = extractNumber(recoveryRecord ?? {}, ["score.recovery_score", "score.user_calibrating"]);
    const strain = extractNumber(workoutRecord ?? {}, ["score.strain", "strain", "score.day_strain"]);
    const sleepMillis = extractNumber(sleepRecord ?? {}, [
      "score.stage_summary.total_in_bed_time_milli",
      "score.sleep_needed.baseline_milli",
      "score.sleep_performance_percentage",
    ]);

    const sleepHours =
      sleepMillis && sleepMillis > 1000 ? Number((sleepMillis / 3_600_000).toFixed(1)) : parseNumber(sleepMillis);

    const updatedAt =
      (getPath(recoveryRecord ?? {}, "updated_at") as string | undefined) ??
      (getPath(workoutRecord ?? {}, "updated_at") as string | undefined) ??
      (getPath(sleepRecord ?? {}, "updated_at") as string | undefined) ??
      null;

    return {
      status: "connected",
      recovery,
      strain,
      sleepHours,
      updatedAt: updatedAt ?? null,
    };
  } catch (error) {
    // Check if it's a 401 error - retry with forced token refresh
    const errorMsg = String(error);
    if (errorMsg.includes("401")) {
      console.log("[WHOOP] Got 401, retrying with fresh token...");
      try {
        const result = await fetchAllData(true);
        if ("error" in result) {
          return {
            status: "disconnected",
            reason: "missing_tokens",
            message: "No WHOOP access token available after refresh.",
          };
        }

        const { recoveryRecord, workoutRecord, sleepRecord } = result;
        const recovery = extractNumber(recoveryRecord ?? {}, ["score.recovery_score", "score.user_calibrating"]);
        const strain = extractNumber(workoutRecord ?? {}, ["score.strain", "strain", "score.day_strain"]);
        const sleepMillis = extractNumber(sleepRecord ?? {}, [
          "score.stage_summary.total_in_bed_time_milli",
          "score.sleep_needed.baseline_milli",
          "score.sleep_performance_percentage",
        ]);
        const sleepHours =
          sleepMillis && sleepMillis > 1000 ? Number((sleepMillis / 3_600_000).toFixed(1)) : parseNumber(sleepMillis);
        const updatedAt =
          (getPath(recoveryRecord ?? {}, "updated_at") as string | undefined) ??
          (getPath(workoutRecord ?? {}, "updated_at") as string | undefined) ??
          (getPath(sleepRecord ?? {}, "updated_at") as string | undefined) ??
          null;

        return {
          status: "connected",
          recovery,
          strain,
          sleepHours,
          updatedAt: updatedAt ?? null,
        };
      } catch (retryError) {
        console.error("[WHOOP] Retry also failed:", retryError);
      }
    }

    console.error("Failed to fetch WHOOP widget data:", error);
    return {
      status: "disconnected",
      reason: "fetch_failed",
      message: "WHOOP data fetch failed. Reconnect and retry.",
    };
  }
}
