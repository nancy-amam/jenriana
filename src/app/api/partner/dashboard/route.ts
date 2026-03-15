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

    const partnerId = (user._id as mongoose.Types.ObjectId).toString();
    const myApartmentIds = await Apartment.find({ ownerId: user._id })
      .select("_id")
      .lean()
      .then((list) => list.map((a) => a._id));

    if (myApartmentIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalBookings: 0,
          totalEarnings: 0,
          amountPaid: 0,
          amountPending: 0,
        },
        chartData: [],
        earningsByApartment: [],
        recentBookings: [],
      });
    }

    const bookings = await Booking.find({
      apartmentId: { $in: myApartmentIds },
      status: "confirmed",
    })
      .populate("apartmentId", "name")
      .sort({ createdAt: -1 })
      .lean();

    let totalBookings = 0;
    let totalEarnings = 0;
    let amountPaid = 0;
    let amountPending = 0;
    const earningsByApartmentMap = new Map<string, number>();

    for (const b of bookings) {
      const amount = b.totalAmount ?? 0;
      const commission = amount * COMMISSION_RATE;
      const net = amount - commission;
      totalBookings += 1;
      totalEarnings += net;
      if (b.partnerPayoutStatus === "paid") {
        amountPaid += net;
      } else {
        amountPending += net;
      }
      const aptId = (b.apartmentId as any)?._id?.toString?.() ?? (b.apartmentId as mongoose.Types.ObjectId).toString();
      const aptName = (b.apartmentId as any)?.name ?? "Property";
      earningsByApartmentMap.set(aptName, (earningsByApartmentMap.get(aptName) ?? 0) + net);
    }

    const earningsByApartment = Array.from(earningsByApartmentMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));

    const now = new Date();
    const last30Start = new Date(now);
    last30Start.setDate(last30Start.getDate() - 30);
    const last30Bookings = bookings.filter(
      (b) => new Date(b.createdAt) >= last30Start
    );
    const byDay = new Map<string, number>();
    last30Bookings.forEach((b) => {
      const d = new Date(b.createdAt).toISOString().slice(0, 10);
      const net = (b.totalAmount ?? 0) * (1 - COMMISSION_RATE);
      byDay.set(d, (byDay.get(d) ?? 0) + net);
    });
    const chartData = Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, earnings]) => ({ label, earnings }));

    const recentBookings = bookings.slice(0, 5).map((b) => ({
      id: (b._id as mongoose.Types.ObjectId).toString(),
      customerName: b.customerName,
      apartmentName: (b.apartmentId as any)?.name ?? "Property",
      bookingCode: b.bookingCode,
      totalAmount: b.totalAmount,
      status: b.status,
      timeAgo: formatTimeAgo(b.createdAt),
    }));

    return NextResponse.json({
      stats: {
        totalBookings,
        totalEarnings: Math.round(totalEarnings),
        amountPaid: Math.round(amountPaid),
        amountPending: Math.round(amountPending),
      },
      chartData,
      earningsByApartment,
      recentBookings,
    });
  } catch (err) {
    console.error("Partner dashboard error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

function formatTimeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
