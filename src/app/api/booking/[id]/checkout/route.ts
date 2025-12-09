import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/api/lib/mongodb";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import Booking from "@/models/bookings";
import Coupon from "@/models/coupon";
import { PaystackService } from "@/app/api/lib/paystack.service";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });

    const booking = await Booking.findById(id);
    if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

    if (booking.status !== "pending")
      return NextResponse.json({ message: "Booking already processed" }, { status: 400 });

    const { paymentMethod, couponId, callback_url } = await req.json();

    let finalAmount = booking.totalAmount;

    if (couponId) {
      const coupon = await Coupon.findById(couponId);

      if (!coupon || coupon.isUsed || !coupon.isUsable) {
        return NextResponse.json({ message: "Invalid or expired coupon" }, { status: 400 });
      }

      const discountAmount = (booking.totalAmount * coupon.discount) / 100;
      finalAmount = booking.totalAmount - discountAmount;

      booking.totalAmount = finalAmount;
      booking.coupon = coupon._id;
      await booking.save();

      coupon.isUsed = true;
      coupon.useBy = user._id;
      await coupon.save();
    }

    if (paymentMethod === "bank-transfer") {
      return NextResponse.json(
        { message: "Bank transfer details", bookingId: booking._id, success: true },
        { status: 200 }
      );
    }

    const paystack = new PaystackService();
    const transaction = await paystack.initializeTransaction({
      email: user.email,
      amount: finalAmount,
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?bookingId=${booking._id}`,
    });

    return NextResponse.json(
      {
        message: "Checkout initialized",
        bookingId: booking._id,
        payment: transaction,
        success: true,
        finalAmount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
