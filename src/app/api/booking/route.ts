// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../lib/mongodb';
import Booking from '../../../models/bookings';
import { getUserFromRequest } from '../lib/getUserFromRequest';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    const body = await req.json();

    const {
      apartmentId,
      checkInDate,
      checkOutDate,
      guests,
      totalAmount,
      paymentMethod,
    } = body;

    if (!apartmentId || !checkInDate || !checkOutDate || !guests || !paymentMethod) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const booking = await Booking.create({
      user: user?._id,
      apartment: apartmentId,
      checkInDate,
      checkOutDate,
      guests,
      totalAmount,
      paymentMethod,
    });

    return NextResponse.json({ message: 'Booking created', booking }, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const bookings = await Booking.find()
      .populate('user', 'fullname email')
      .populate('apartment', 'name location pricePerNight');

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
