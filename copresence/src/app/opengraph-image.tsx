import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt =
  "Tarat — robotics, AI, and small things on the internet";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Tarat's Garden",
    title: "Tarat",
    description:
      "Robotics, AI, and small things on the internet. Currently a student at the University of Edinburgh.",
  });
}
