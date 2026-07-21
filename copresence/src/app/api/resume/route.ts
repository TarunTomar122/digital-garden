import { NextResponse } from "next/server";
import { generateResumeHtml } from "@/lib/resume-generate";

export async function GET() {
  try {
    const generated = await generateResumeHtml();
    return NextResponse.json(generated, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
