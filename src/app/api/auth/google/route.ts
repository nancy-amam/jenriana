import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_REDIRECT = process.env.GOOGLE_REDIRECT_URL as string;

export async function GET() {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT,
      response_type: "code",
      scope: "email profile openid",
      prompt: "select_account",
    }).toString();

  return NextResponse.json({ redirectUrl });
}
