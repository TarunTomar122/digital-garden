import { pickResumeVariant } from "@/lib/resume-variants";

const MODEL = "curated-local";

export async function generateResumeHtml(): Promise<{
  html: string;
  model: string;
  generatedAt: string;
  variant: string;
}> {
  const variant = pickResumeVariant();

  return {
    html: variant.html,
    model: MODEL,
    generatedAt: new Date().toISOString(),
    variant: variant.name,
  };
}
