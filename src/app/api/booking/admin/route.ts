import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import Booking from "../../../../models/bookings";
import Apartment from "../../../../models/apartment";

export async function GET(req: Request) {
  const user = await getUserFromRequest();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find()
      .populate("apartmentId",)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Booking.countDocuments(),
  ]);

  return NextResponse.json({
    message: "Bookings fetched successfully",
    total,
    page,
    pages: Math.ceil(total / limit),
    bookings,
  });
}
