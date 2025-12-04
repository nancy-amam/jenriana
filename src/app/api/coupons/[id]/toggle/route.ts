import { NextResponse } from "next/server";
import Coupon from "@/models/coupon";
import connectDB from "@/app/api/lib/mongodb";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const id = (await params).id;

    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const coupon = await Coupon.findById(id);
    if (!coupon) return NextResponse.json({ message: "Coupon not found" }, { status: 404 });

    coupon.isUsable = !coupon.isUsable;
    await coupon.save();

    return NextResponse.json({
      message: "Coupon usability toggled",
      coupon,
    });
  } catch (err: any) {
    console.error("Toggle Coupon Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
