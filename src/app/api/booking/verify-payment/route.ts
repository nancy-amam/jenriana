/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bookings/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Booking from "@/models/bookings";
import { PaystackService } from "@/app/api/lib/paystack.service"; // adjust import if needed

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { bookingId, reference } = await req.json();
    if (!bookingId || !reference) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId or transactionRef" },
        { status: 400 }
      );
    }

    // 🔹 Verify the transaction with Paystack
    const paystack = new PaystackService()
    const tx = await paystack.verifyTransaction(reference);

    if (tx.status === "success") {
      // ✅ Confirm booking
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "confirmed", transactionId: tx._id },
        { new: true }
      );

      if (!booking) {
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Booking confirmed ✅",
        booking,
      });
    }

    return NextResponse.json(
      { success: false, message: "Payment verification failed." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Payment verification error:", err.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
