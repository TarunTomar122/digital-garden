import { getProjectBySlug } from "@/lib/projects";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Project from Tarat's Garden";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getProjectBySlug(slug);

  return renderOgImage({
    kicker: "Project",
    title: doc?.meta.title ?? "Tarat's Garden",
    description: doc?.meta.description,
  });
}
