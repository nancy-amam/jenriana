import { NextResponse } from "next/server";

import Coupon from "@/models/coupon";
import connectDB from "@/app/api/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });

    const coupon = await Coupon.findOne({ code });

    if (!coupon) return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });

    if (!coupon.isUsable || coupon.isUsed)
      return NextResponse.json({ message: "Coupon is no longer valid" }, { status: 400 });

    return NextResponse.json({
      valid: true,
      discount: coupon.discount,
      coupon,
    });
  } catch (err: any) {
    console.error("Validate Coupon Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
