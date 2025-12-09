import { NextResponse } from "next/server";
import connectDB from "@/app/api/lib/mongodb";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import { TrendingApartment } from "@/models/tending-apartment";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { apartmentId } = await req.json();
    if (!apartmentId) {
      return NextResponse.json({ message: "apartmentId is required" }, { status: 400 });
    }

    const exists = await TrendingApartment.findOne({ apartmentId });
    if (exists) {
      return NextResponse.json({ message: "Already marked as trending" }, { status: 400 });
    }

    const trending = await TrendingApartment.create({ apartmentId });
    return NextResponse.json({ message: "Trending apartment created", data: trending });
  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const trending = await TrendingApartment.find({ active: true }).populate("apartmentId");
    return NextResponse.json({ success: true, data: trending });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
