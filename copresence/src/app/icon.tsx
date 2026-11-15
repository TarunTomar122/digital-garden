import { renderFavicon } from "@/lib/favicon";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return renderFavicon(64);
}
