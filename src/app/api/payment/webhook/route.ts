import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/app/api/lib/mongodb";
import Booking from "@/models/bookings";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer();
  const bodyString = Buffer.from(rawBody).toString("utf-8");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
    .update(bodyString)
    .digest("hex");

  if (hash !== req.headers.get("x-paystack-signature")) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(bodyString);

  if (event.event === "charge.success") {
    await connectDB();
    const bookingId = event.data.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });
    }
  }

  return NextResponse.json({ message: "OK" });
}
