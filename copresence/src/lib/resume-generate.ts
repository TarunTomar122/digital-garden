import fs from "fs";
import path from "path";
import { pickCreativeDirection } from "@/lib/resume-creative";
import { loadDesignContext } from "@/lib/resume-design";

const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const MODEL = "gemma-4-31b";

let resumeDataCache: string | null = null;

function loadResumeData(): string {
  if (resumeDataCache) return resumeDataCache;
  const resumePath = path.join(process.cwd(), "public", "resume.txt");
  resumeDataCache = fs.readFileSync(resumePath, "utf8");
  return resumeDataCache;
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:html)?\s*([\s\S]*?)```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

async function streamCerebrasCompletion(body: Record<string, unknown>): Promise<string> {
  const response = await fetch(CEREBRAS_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cerebras API error (${response.status}): ${errText}`);
  }

  if (!response.body) {
    throw new Error("Cerebras returned an empty stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") continue;

      try {
        const parsed = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        full += parsed.choices?.[0]?.delta?.content ?? "";
      } catch {
        // Skip malformed SSE chunks.
      }
    }
  }

  return full.trim();
}

export async function generateResumeHtml(): Promise<{
  html: string;
  model: string;
  generatedAt: string;
}> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error("CEREBRAS_API_KEY is not configured");
  }

  const resumeData = loadResumeData();
  const creativeDirection = pickCreativeDirection();

  const systemPrompt = `Design a resume HTML fragment for tarat.space.

BRAND: bg #fdf5e2, text #000, muted #6b7280, Canela/Georgia headings, Inter body, Geist spacing (16px groups, 32px sections, 6px radii).

${loadDesignContext()}

${creativeDirection}

OUTPUT:
- HTML fragment only: leading <style> then markup. No <html>/<body>.
- Facts from RESUME DATA only. No invented details. No AI/meta copy.
- Compact output — tight CSS, no comments, no filler. Under ~200 lines total.
- Mobile-responsive. Inter via @import. No JS.`;

  const userPrompt = `RESUME DATA:\n${resumeData}`;

  const raw = await streamCerebrasCompletion({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.9,
    top_p: 0.9,
    max_tokens: 2800,
  });

  if (!raw) {
    throw new Error("Cerebras returned an empty response");
  }

  return {
    html: stripCodeFences(raw),
    model: MODEL,
    generatedAt: new Date().toISOString(),
  };
}