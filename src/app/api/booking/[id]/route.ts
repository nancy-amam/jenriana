// src/app/api/booking/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Booking from '../../../../models/bookings';
import { getUserFromRequest } from '../../lib/getUserFromRequest';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = await params; 
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    const booking = await Booking.findOne({ _id: id, userId: user._id });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Prevent cancelling past or already cancelled bookings
    if (booking.status === 'cancelled') {
      return NextResponse.json({ message: 'Booking already cancelled' }, { status: 400 });
    }
    if (new Date(booking.checkInDate) <= new Date()) {
      return NextResponse.json({ message: 'Cannot cancel booking that has already started' }, { status: 400 });
    }

    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({ message: 'Booking cancelled successfully', booking }, { status: 200 });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
