import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import Apartment from "@/models/apartment";
import Booking from "@/models/bookings";

const COMMISSION_RATE = 0.1;

export async function GET() {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "partner") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const myApartmentIds = await Apartment.find({ ownerId: user._id })
      .select("_id name location")
      .lean();
    const aptMap = new Map(
      myApartmentIds.map((a) => [a._id.toString(), { name: a.name, location: a.location }])
    );
    const ids = myApartmentIds.map((a) => a._id);

    const bookings = await Booking.find({
      apartmentId: { $in: ids },
      status: "confirmed",
    })
      .sort({ createdAt: -1 })
      .lean();

    const transactions = bookings.map((b) => {
      const amount = b.totalAmount ?? 0;
      const commission = amount * COMMISSION_RATE;
      const net = amount - commission;
      const apt = aptMap.get((b.apartmentId as mongoose.Types.ObjectId).toString());
      return {
        id: (b._id as mongoose.Types.ObjectId).toString(),
        bookingCode: b.bookingCode,
        date: (b.createdAt as Date).toISOString?.()?.slice(0, 10) ?? "",
        apartmentName: apt?.name ?? "",
        apartmentLocation: apt?.location,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone,
        residentialAddress: b.residentialAddress,
        amount,
        commission,
        net,
        paymentStatus: b.partnerPayoutStatus === "paid" ? "paid" : "pending",
        paidAt: b.partnerPaidAt ? new Date(b.partnerPaidAt).toISOString().slice(0, 10) : undefined,
        checkInDate: (b.checkInDate as Date).toISOString?.()?.slice(0, 10) ?? "",
        checkOutDate: (b.checkOutDate as Date).toISOString?.()?.slice(0, 10) ?? "",
        nights: Math.ceil(
          (new Date(b.checkOutDate).getTime() - new Date(b.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
        ),
        guests: b.guests ?? 0,
        paymentMethod: b.paymentMethod,
        specialRequest: b.specialRequest,
      };
    });

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error("Partner transactions error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
