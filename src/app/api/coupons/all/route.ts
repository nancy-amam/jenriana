import { NextResponse } from "next/server";

import Coupon from "@/models/coupon";
import connectDB from "@/app/api/lib/mongodb";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";

export async function GET() {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json({ coupons });
  } catch (err: any) {
    console.error("Get All Coupons Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
