/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import connectDB from "../../lib/mongodb";
import Booking from "../../../../models/bookings";
import Apartment from "@/models/apartment";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    // Get query param
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'active' | 'history'

    const bookings = await Booking.find({ userId: user._id })
      .populate("apartmentId", 'name location pricePerNight gallery')
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const activeBookings = bookings.filter(b => 
      new Date(b.checkInDate) > now && b.status !== 'cancelled'
    ).map(b => ({
      ...b,
      canCancel: new Date(b.checkInDate) > now && b.status !== 'cancelled'
    }));

    const bookingHistory = bookings.filter(b => 
      new Date(b.checkInDate) <= now || b.status === 'cancelled'
    ).map(b => ({
      ...b,
      canCancel: false
    }));

    // Apply filter if query param exists
    if (type === 'active') {
      return NextResponse.json({ bookings: activeBookings }, { status: 200 });
    } else if (type === 'history') {
      return NextResponse.json({ bookings: bookingHistory }, { status: 200 });
    }

    // Default: return both
    return NextResponse.json({
      activeBookings,
      bookingHistory
    }, { status: 200 });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}