/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import Apartment from "@/models/apartment";
import Booking from "@/models/bookings";
import mongoose from "mongoose";
import connectDB from "../../../lib/mongodb";
import { getUserFromRequest } from "../../../lib/getUserFromRequest";

const COMMISSION_RATE = 0.1;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "Partner ID required" }, { status: 400 });
    }

    const partner = await User.findOne({ _id: id, role: "partner" })
      .select("firstName lastName email phone createdAt")
      .lean();

    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    }

    const partnerId = partner._id as mongoose.Types.ObjectId;
    const apartments = await Apartment.find({ ownerId: partnerId })
      .select("name location address pricePerNight status _id")
      .lean();

    const apartmentIds = apartments.map((a) => a._id);

    const bookings = await Booking.find({
      apartmentId: { $in: apartmentIds },
      status: "confirmed",
    })
      .populate("apartmentId", "name location")
      .sort({ createdAt: -1 })
      .lean();

    let totalEarnings = 0;
    let totalPaid = 0;
    let totalPending = 0;

    const bookingList = bookings.map((b) => {
      const amount = b.totalAmount ?? 0;
      const commission = amount * COMMISSION_RATE;
      const net = amount - commission;
      const isPaid = b.partnerPayoutStatus === "paid";
      if (isPaid) {
        totalPaid += net;
      } else {
        totalPending += net;
      }
      totalEarnings += net;
      const apt = b.apartmentId as any;
      return {
        _id: (b._id as mongoose.Types.ObjectId).toString(),
        bookingCode: b.bookingCode,
        apartmentName: apt?.name ?? "—",
        apartmentLocation: apt?.location ?? "—",
        totalAmount: amount,
        commission: Math.round(commission),
        net: Math.round(net),
        partnerPayoutStatus: b.partnerPayoutStatus ?? "pending",
        partnerPaidAt: b.partnerPaidAt ?? null,
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
        createdAt: b.createdAt,
      };
    });

    const fullname = [partner.firstName, partner.lastName].filter(Boolean).join(" ").trim() || partner.email;

    return NextResponse.json({
      message: "Partner details fetched successfully",
      partner: {
        _id: (partner._id as mongoose.Types.ObjectId).toString(),
        fullname,
        firstName: partner.firstName,
        lastName: partner.lastName,
        email: partner.email,
        phone: partner.phone ?? "",
        createdAt: partner.createdAt,
        totalEarnings: Math.round(totalEarnings),
        totalPaid: Math.round(totalPaid),
        totalPending: Math.round(totalPending),
      },
      apartments: apartments.map((a) => ({
        _id: (a._id as mongoose.Types.ObjectId).toString(),
        name: a.name,
        location: a.location,
        address: a.address,
        pricePerNight: a.pricePerNight,
        status: a.status,
      })),
      bookings: bookingList,
    });
  } catch (err) {
    console.error("Admin partner detail GET error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
