import { NextRequest, NextResponse } from "next/server";
import {
  clearCachedResume,
  getCachedResume,
  setCachedResume,
} from "@/lib/resume-cache";
import { generateResumeHtml } from "@/lib/resume-generate";
import {
  consumeGlobalGeneration,
  consumeRefreshAttempt,
  getClientIp,
  peekGlobalGenerationLimit,
  peekRefreshLimit,
} from "@/lib/resume-refresh-limit";

const RATE_LIMIT_MESSAGE = "calm down bruh!! dont make me go broke";
const GLOBAL_LIMIT_MESSAGE =
  "the whole internet used up today's resume budget lol";

export async function GET(req: NextRequest) {
  const refresh = req.nextUrl.searchParams.get("refresh") === "true";

  try {
    if (!refresh) {
      const cached = await getCachedResume();
      if (cached) {
        return NextResponse.json(
          { ...cached, cached: true },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=86400, stale-while-revalidate=3600",
            },
          },
        );
      }
    }

    if (refresh) {
      const refreshLimit = await peekRefreshLimit(getClientIp(req));
      if (!refreshLimit.allowed) {
        return NextResponse.json(
          {
            error: "rate_limited",
            message: RATE_LIMIT_MESSAGE,
            remaining: refreshLimit.remaining,
            limit: refreshLimit.limit,
          },
          { status: 429 },
        );
      }
    }

    const globalPeek = await peekGlobalGenerationLimit();
    if (!globalPeek.allowed) {
      return NextResponse.json(
        {
          error: "global_limit",
          message: GLOBAL_LIMIT_MESSAGE,
          remaining: globalPeek.remaining,
          limit: globalPeek.limit,
        },
        { status: 429 },
      );
    }

    if (refresh) {
      await consumeRefreshAttempt(getClientIp(req));
      void clearCachedResume();
    }

    await consumeGlobalGeneration();

    const generated = await generateResumeHtml();

    const response = NextResponse.json({
      ...generated,
      cached: false,
    });

    void setCachedResume(generated);

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}