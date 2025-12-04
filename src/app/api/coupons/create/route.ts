import { NextResponse } from "next/server";

import Coupon from "@/models/coupon";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { code, discount } = await req.json();

    if (!code || !discount) return NextResponse.json({ message: "Code and discount are required" }, { status: 400 });

    const existing = await Coupon.findOne({ code });
    if (existing) return NextResponse.json({ message: "Coupon code already exists" }, { status: 409 });

    const coupon = await Coupon.create({ code, discount });

    return NextResponse.json({ message: "Coupon created", coupon }, { status: 201 });
  } catch (err: any) {
    console.error("Create Coupon Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
