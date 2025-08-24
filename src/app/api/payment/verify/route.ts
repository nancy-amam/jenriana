import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/lib/mongodb";
import Booking from "@/models/bookings";
import { PaystackService } from "@/app/api/lib/paystack.service";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    const bookingId = searchParams.get("bookingId");

    if (!reference || !bookingId) {
      return NextResponse.json({ message: "Missing payment reference or booking ID" }, { status: 400 });
    }

    const paystack = new PaystackService();
    const verification = await paystack.verifyTransaction(reference);

    if (verification.status === "success") {
      await Booking.findByIdAndUpdate(bookingId, { status: "confirmed", expireAt: null });
      return NextResponse.json({ message: "Payment successful, booking confirmed" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Payment not successful" }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
