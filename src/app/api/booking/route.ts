/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../lib/mongodb';
import Booking from '../../../models/bookings';
import { getUserFromRequest } from '../lib/getUserFromRequest';
import Apartment from '@/models/apartment';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user) {
  return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
}
    const body = await req.json();

    const {
      apartmentId,
      checkInDate,
      checkOutDate,
      guests,
      paymentMethod,
    } = body;

    if (!apartmentId || !checkInDate || !checkOutDate || !guests || !paymentMethod) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // ✅ Fetch apartment to get nightly price
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return NextResponse.json({ message: 'Apartment not found' }, { status: 404 });
    }

    // ✅ Calculate number of days
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();

    if (timeDiff <= 0) {
      return NextResponse.json({ message: 'Invalid check-in/check-out dates' }, { status: 400 });
    }

    const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // ✅ Calculate total amount
    const totalAmount = apartment.pricePerNight * numberOfDays;

    // ✅ Create booking
    const booking = await Booking.create({
      userId: user?._id,
      apartmentId,
      checkInDate,
      checkOutDate,
      guests,
      totalAmount,
      paymentMethod,
    });

    return NextResponse.json(
      { message: 'Booking created', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

