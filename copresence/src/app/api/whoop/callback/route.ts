import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/whoop";

const OAUTH_STATE_COOKIE = "whoop_oauth_state";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?whoop=error", request.url));
  }

  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/?whoop=state_mismatch", request.url));
  }

  try {
    await exchangeCodeForTokens(code);
    const response = NextResponse.redirect(new URL("/?whoop=connected", request.url));
    response.cookies.delete(OAUTH_STATE_COOKIE);
    return response;
  } catch (exchangeError) {
    console.error("WHOOP callback failed:", exchangeError);
    return NextResponse.redirect(new URL("/?whoop=token_error", request.url));
  }
}
