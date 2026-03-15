import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import User from "@/models/user";
import { sendEmail } from "@/services/email.service";
import { setOtp } from "../otp-store";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email, role: "partner" }).select("_id email").lean();
    if (!user) {
      return NextResponse.json(
        { message: "No partner account found for this email. Contact your admin." },
        { status: 404 }
      );
    }

    const code = generateCode();
    setOtp(email, code);

    const subject = "Your partner verification code – Jenriana";
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111827;">Partner verification code</h2>
        <p>Use this code to set up your partner account password:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #212121;">${code}</p>
        <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
        <p style="color: #6b7280; font-size: 14px;">— Jenriana</p>
      </div>
    `;

    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error("Partner send-otp error:", err);
    return NextResponse.json(
      { message: "Failed to send code. Please try again." },
      { status: 500 }
    );
  }
}
