/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import { PaystackService } from "@/app/api/lib/paystack.service";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/bookings";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // Await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    // Fetch booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "pending") {
      return NextResponse.json({ message: "Booking already processed" }, { status: 400 });
    }

    // Get payment method and callback_url from request body
    const { paymentMethod, callback_url } = await req.json();
    
    console.log('Received callback_url from frontend:', callback_url);

    if (paymentMethod === "bank-transfer") {
      return NextResponse.json(
        {
          message: "Bank transfer details",
          bookingId: booking._id,
          bankDetails: {
            bankName: "Jenrianna Bank",
            accountName: "Jenrianna Apartments",
            accountNumber: "1234567890",
            note: "Your booking will be confirmed upon receipt of payment.",
          },
          success: true,
        },
        { status: 200 }
      );
    }

    // Initialize payment for card - Use the callback_url from frontend
    const paystack = new PaystackService();
    const transaction = await paystack.initializeTransaction({
      email: user.email,
      amount: booking.totalAmount,
      // Use callback_url from frontend, fallback to default if not provided
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?bookingId=${booking._id}`,
    });

    console.log('Paystack transaction initialized with callback_url:', callback_url);

    return NextResponse.json(
      {
        message: "Checkout initialized",
        bookingId: booking._id,
        payment: transaction,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}