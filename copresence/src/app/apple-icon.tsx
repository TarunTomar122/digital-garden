import { renderFavicon } from "@/lib/favicon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the square stays square.
export default function AppleIcon() {
  return renderFavicon(180, false);
}
