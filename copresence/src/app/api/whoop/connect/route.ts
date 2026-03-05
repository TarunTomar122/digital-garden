import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { buildWhoopAuthUrl } from "@/lib/whoop";

const OAUTH_STATE_COOKIE = "whoop_oauth_state";

export async function GET() {
  try {
    const state = randomUUID();
    const authUrl = buildWhoopAuthUrl(state);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set({
      name: OAUTH_STATE_COOKIE,
      value: state,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("WHOOP connect init failed:", error);
    return NextResponse.redirect(new URL("/?whoop=missing_config", process.env.WHOOP_REDIRECT_URI ?? "http://localhost:3000"));
  }
}
