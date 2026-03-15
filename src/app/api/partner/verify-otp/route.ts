import { NextResponse } from "next/server";
import { getOtp } from "../otp-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.otp === "string" ? body.otp.replace(/\D/g, "") : "";

    if (!email || !code || code.length !== 6) {
      return NextResponse.json({ message: "Email and 6-digit code are required" }, { status: 400 });
    }

    const entry = getOtp(email);
    if (!entry) {
      return NextResponse.json(
        { message: "Code expired or invalid. Request a new code." },
        { status: 400 }
      );
    }
    if (entry.code !== code) {
      return NextResponse.json({ message: "Invalid code." }, { status: 400 });
    }

    return NextResponse.json({ verified: true, message: "Code verified" });
  } catch (err) {
    console.error("Partner verify-otp error:", err);
    return NextResponse.json({ message: "Verification failed." }, { status: 500 });
  }
}
