// pages/api/admin/analytics.ts
// import { NextApiRequest, NextApiResponse } from "next";
import Booking from "@/models/bookings";
import Apartment from "@/models/apartment";
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

export async function GET() {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const totalApartments = await Apartment.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Revenue this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const revenueThisMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: "confirmed",
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalAmount" } },
      },
    ]);

    // Revenue last month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const revenueLastMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: "confirmed",
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalAmount" } },
      },
    ]);

    const thisMonth = revenueThisMonth[0]?.total || 0;
    const lastMonth = revenueLastMonth[0]?.total || 0;
    const percentageChange =
      lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

    return NextResponse.json({
      totalApartments,
      totalBookings,
      revenueThisMonth: thisMonth,
      percentageChange: percentageChange.toFixed(2),
    }, { status: 200 });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
