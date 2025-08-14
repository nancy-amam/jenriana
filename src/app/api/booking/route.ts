/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../lib/mongodb';
import Booking from '../../../models/bookings';
import { getUserFromRequest } from '../lib/getUserFromRequest';
import Apartment from '@/models/apartment';
import { PaystackService } from '../lib/paystack.service';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    const { apartmentId, checkInDate, checkOutDate, guests, paymentMethod } = await req.json();

    if (!apartmentId || !checkInDate || !checkOutDate || !guests || !paymentMethod) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Fetch apartment price
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    // Calculate total amount
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    if (timeDiff <= 0) {
      return NextResponse.json({ message: 'Invalid check-in/check-out dates' }, { status: 400 });
    }
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = days * apartment.pricePerNight;

    // Create booking in "pending" state
    const booking = await Booking.create({
      userId: user?._id,
      apartmentId,
      checkInDate,
      checkOutDate,
      guests,
      totalAmount,
      paymentMethod,
      status: "pending",
    });

    // Initialize Paystack payment
    const paystack = new PaystackService();
const transaction = await paystack.initializeTransaction({
  email: user?.email as any,
  amount: totalAmount,
  callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify?bookingId=${booking._id}`
});

    return NextResponse.json(
      {
        message: "Booking created. Proceed to payment.",
        bookingId: booking._id,
        payment: transaction, // includes authorization_url
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}