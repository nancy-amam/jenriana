/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import { PaystackService } from "@/app/api/lib/paystack.service";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/bookings";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    // Fetch booking
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "pending") {
      return NextResponse.json({ message: "Booking already processed" }, { status: 400 });
    }

    // Initialize payment
    const paystack = new PaystackService();
    const transaction = await paystack.initializeTransaction({
      email: user.email,
      amount: booking.totalAmount,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify?bookingId=${booking._id}`,
    });

    return NextResponse.json(
      {
        message: "Checkout initialized",
        bookingId: booking._id,
        payment: transaction, 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
