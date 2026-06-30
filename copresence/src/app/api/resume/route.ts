import { NextRequest, NextResponse } from "next/server";
import {
  clearCachedResume,
  getCachedResume,
  setCachedResume,
} from "@/lib/resume-cache";
import { generateResumeHtml } from "@/lib/resume-generate";

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
    } else {
      void clearCachedResume();
    }

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