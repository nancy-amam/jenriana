import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "../../lib/mongodb";
import User from "@/models/user";
import { consumeOtp } from "../otp-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const code = typeof body.otp === "string" ? body.otp.replace(/\D/g, "") : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!email || !code || code.length !== 6) {
      return NextResponse.json({ message: "Email and verification code are required" }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (!consumeOtp(email, code)) {
      return NextResponse.json(
        { message: "Code expired or invalid. Please request a new code." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email, role: "partner" });
    if (!user) {
      return NextResponse.json({ message: "Partner account not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password set successfully. You can now sign in." });
  } catch (err) {
    console.error("Partner set-password error:", err);
    return NextResponse.json(
      { message: "Could not set password. Please try again." },
      { status: 500 }
    );
  }
}
