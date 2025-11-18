/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/bookings";
import connectDB from "../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const apartmentId = searchParams.get("apartmentId") || undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query: any = {
      status: "confirmed",
      checkOutDate: { $gte: today },
    };

    if (apartmentId) {
      query.apartmentId = apartmentId;
    }

    const bookings = await Booking.find(query).select("checkInDate checkOutDate");

    const dayMs = 24 * 60 * 60 * 1000;
    const datesSet = new Set<string>();

    bookings.forEach((b: any) => {
      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

      // Ensure we only include dates from today forward
      let current = start < today ? new Date(today) : start;
      current.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // include every night from check-in up to (but not including) checkout
      while (current < end) {
        datesSet.add(current.toISOString());
        current = new Date(current.getTime() + dayMs);
      }
    });

    const bookedDates = Array.from(datesSet).sort();

    return NextResponse.json({
      success: true,
      bookedDates,
    });
  } catch (error: any) {
    console.error("Error fetching booked dates:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch booked dates" }, { status: 500 });
  }
}
