/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import Booking from "../../../../models/bookings";
import   "../../../../models/apartment";
export async function GET(req: Request) {
  const user = await getUserFromRequest();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;


  const search = searchParams.get("search") || "";
  const amountPaid = searchParams.get("amountPaid");
  const arrivalDate = searchParams.get("arrivalDate");
  const departureDate = searchParams.get("departureDate");
  const bookingDate = searchParams.get("bookingDate"); 

  const filter: any = {};

  if (search) {
    filter.$or = [
      { bookingCode: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { customerName: { $regex: search, $options: "i" } },
    ];
  }

  // Exact amount search
  if (amountPaid) {
    filter.amountPaid = Number(amountPaid);
  }

  // Date filters (ISO strings expected: YYYY-MM-DD)
  if (arrivalDate) {
    filter.arrivalDate = { $gte: new Date(arrivalDate) };
  }
  if (departureDate) {
    filter.departureDate = { $lte: new Date(departureDate) };
  }
  if (bookingDate) {
    // Match all bookings created on this day
    const start = new Date(bookingDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(bookingDate);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = { $gte: start, $lte: end };
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("apartmentId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Booking.countDocuments(filter),
  ]);

  return NextResponse.json({
    message: "Bookings fetched successfully",
    total,
    page,
    pages: Math.ceil(total / limit),
    bookings,
  });
}
