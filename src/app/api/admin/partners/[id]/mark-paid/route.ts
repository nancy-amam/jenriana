/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import Apartment from "@/models/apartment";
import Booking from "@/models/bookings";
import mongoose from "mongoose";
import connectDB from "../../../../lib/mongodb";
import { getUserFromRequest } from "../../../../lib/getUserFromRequest";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id: partnerId } = await params;
    if (!partnerId) {
      return NextResponse.json({ message: "Partner ID required" }, { status: 400 });
    }

    const partner = await User.findOne({ _id: partnerId, role: "partner" });
    if (!partner) {
      return NextResponse.json({ message: "Partner not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { bookingIds } = body; // optional: array of booking IDs to mark paid. If omitted, mark all pending for this partner.

    const apartmentIds = await Apartment.find({ ownerId: partner._id })
      .distinct("_id");

    const filter: any = {
      apartmentId: { $in: apartmentIds },
      status: "confirmed",
      $or: [{ partnerPayoutStatus: { $ne: "paid" } }, { partnerPayoutStatus: null }],
    };

    if (Array.isArray(bookingIds) && bookingIds.length > 0) {
      const validIds = bookingIds
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
        .map((id: string) => new mongoose.Types.ObjectId(id));
      if (validIds.length === 0) {
        return NextResponse.json({ message: "No valid booking IDs provided" }, { status: 400 });
      }
      filter._id = { $in: validIds };
    }

    const result = await Booking.updateMany(filter, {
      $set: {
        partnerPayoutStatus: "paid",
        partnerPaidAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Payout(s) marked as paid",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Admin mark-paid PATCH error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
