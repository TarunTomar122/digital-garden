import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

const domineBold = fs.readFileSync(
  path.join(process.cwd(), "public/fonts/Domine/Domine-Bold.woff")
);

/** Site mark: a lowercase Domine "t" on ink, with the robot arm's red joint. */
export function renderFavicon(size: number, rounded = true) {
  const u = size / 32; // drawn on a 32-unit grid
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#171717",
          borderRadius: rounded ? 7 * u : 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 30 * u,
            top: 1 * u,
            display: "flex",
            justifyContent: "center",
            fontFamily: "Domine",
            fontWeight: 700,
            fontSize: 26 * u,
            color: "#ffffff",
          }}
        >
          t
        </div>
        <div
          style={{
            position: "absolute",
            left: 20.5 * u,
            top: 6.5 * u,
            width: 6 * u,
            height: 6 * u,
            borderRadius: 999,
            background: "#dc2626",
          }}
        />
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Domine", data: domineBold, weight: 700, style: "normal" }],
    }
  );
}
