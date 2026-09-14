import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

const fontRegular = fs.readFileSync(
  path.join(process.cwd(), "public/fonts/Domine/Domine-Regular.woff")
);
const fontBold = fs.readFileSync(
  path.join(process.cwd(), "public/fonts/Domine/Domine-Bold.woff")
);

const ROBOT_ARM_SVG = `<svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fafafa"/><stop offset="0.55" stop-color="#e4e4e7"/><stop offset="1" stop-color="#c9c9ce"/>
    </linearGradient>
    <radialGradient id="j" cx="0.35" cy="0.3" r="0.95">
      <stop offset="0" stop-color="#52525b"/><stop offset="1" stop-color="#18181b"/>
    </radialGradient>
  </defs>
  <ellipse cx="150" cy="272" rx="60" ry="8" fill="rgba(23,23,23,0.08)"/>
  <rect x="116" y="263" width="68" height="10" rx="4" fill="#18181b"/>
  <rect x="128" y="231" width="44" height="36" rx="9" fill="#18181b"/>
  <circle cx="150" cy="224" r="18" fill="url(#j)"/>
  <circle cx="150" cy="224" r="11" fill="none" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="2.5 3.5" opacity="0.9"/>
  <circle cx="150" cy="224" r="4" fill="#71717a"/>
  <g transform="translate(150 220) rotate(-78)">
    <rect x="8" y="-12" width="72" height="24" rx="12" fill="url(#m)" stroke="#a1a1aa" stroke-width="1"/>
    <rect x="20" y="-4" width="42" height="8" rx="4" fill="#18181b" opacity="0.82"/>
    <circle cx="80" cy="0" r="14" fill="url(#j)"/>
    <circle cx="80" cy="0" r="5" fill="#3f3f46"/>
    <circle cx="80" cy="0" r="2" fill="#a1a1aa"/>
    <g transform="translate(80 0) rotate(20)">
      <rect x="6" y="-10" width="64" height="20" rx="10" fill="url(#m)" stroke="#a1a1aa" stroke-width="1"/>
      <rect x="16" y="-3.5" width="38" height="7" rx="3.5" fill="#18181b" opacity="0.82"/>
      <rect x="64" y="-11" width="16" height="22" rx="5" fill="#18181b"/>
      <circle cx="72" cy="0" r="3" fill="#52525b"/>
      <g transform="translate(78 0)">
        <path d="M0 -14 C10 -15 20 -13 27 -9 L23 -3 C17 -6 9 -6 2 -5 Z" fill="#27272a"/>
        <path d="M0 14 C10 15 20 13 27 9 L23 3 C17 6 9 6 2 5 Z" fill="#27272a"/>
      </g>
    </g>
  </g>
</svg>`;

const armDataUri = `data:image/svg+xml,${encodeURIComponent(ROBOT_ARM_SVG)}`;

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OgProps = {
  kicker?: string;
  title: string;
  description?: string;
};

export function renderOgImage({ kicker, title, description }: OgProps) {
  const titleSize = title.length > 64 ? 52 : title.length > 34 ? 64 : 78;
  const desc =
    description && description.length > 150
      ? `${description.slice(0, 147).trimEnd()}…`
      : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#ffffff",
          padding: "48px 72px",
          fontFamily: "Domine",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 340,
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={armDataUri} width={300} height={300} alt="" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingLeft: 44,
            borderLeft: "1px solid #e4e4e7",
            minHeight: 420,
          }}
        >
          {kicker ? (
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#71717a",
                marginBottom: 20,
              }}
            >
              {kicker}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 700,
              color: "#171717",
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>

          {desc ? (
            <div
              style={{
                display: "flex",
                fontSize: 27,
                color: "#52525b",
                marginTop: 24,
                lineHeight: 1.45,
              }}
            >
              {desc}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 40,
              fontSize: 24,
              color: "#171717",
            }}
          >
            <span>tarat.space</span>
            <span style={{ color: "#d4d4d8" }}>·</span>
            <span style={{ color: "#71717a" }}>@tarat_211</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Domine", data: fontRegular, weight: 400 as const },
        { name: "Domine", data: fontBold, weight: 700 as const },
      ],
    }
  );
}
