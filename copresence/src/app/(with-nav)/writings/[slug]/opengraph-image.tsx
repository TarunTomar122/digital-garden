import { getWritingBySlug } from "@/lib/writings";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Writing from Tarat's Garden";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getWritingBySlug(slug);

  return renderOgImage({
    kicker: "Writing",
    title: doc?.meta.title ?? "Tarat's Garden",
    description: doc?.meta.description,
  });
}
