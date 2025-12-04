import { NextResponse } from "next/server";

import Coupon from "@/models/coupon";
import connectDB from "@/app/api/lib/mongodb";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await Coupon.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Coupon deleted" });
  } catch (err: any) {
    console.error("Delete Coupon Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
