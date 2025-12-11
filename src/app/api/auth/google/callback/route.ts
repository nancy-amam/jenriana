import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "@/models/user";

import { cookies } from "next/headers";
import connectDB from "@/app/api/lib/mongodb";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL as string;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ success: false, message: "No code provided" }, { status: 400 });
  }

  await connectDB();

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: "authorization_code",
    }),
  });

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = await userRes.json();

  let user = await User.findOne({ email: profile.email });

  if (!user) {
    const generatedPassword = await bcrypt.hash(profile.id, 10);

    user = await User.create({
      email: profile.email,
      fullname: profile.name || "Google User",
      phone: "N/A",
      password: generatedPassword,
      role: "user",
      totalBookings: 0,
    });
  }

  const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  (await cookies()).set("token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({
    success: true,
    message: "Google login successful",
    user: {
      id: user._id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token: authToken,
  });
}
