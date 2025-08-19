/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import User from "@/models/user";
import connectDB from "@/app/api/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // aggregate users with booking count
    const [users, total] = await Promise.all([
      User.aggregate([
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "bookings", // collection name in Mongo
            localField: "_id",
            foreignField: "userId", // assuming bookings have `userId`
            as: "bookings",
          },
        },
        {
          $addFields: {
            totalBookings: { $size: "$bookings" },
          },
        },
        {
          $project: {
            password: 0,
            bookings: 0, // don’t return all bookings, just the count
          },
        },
      ]),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      message: "Users fetched successfully",
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}