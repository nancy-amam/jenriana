/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import Booking from "@/models/bookings"; // only to ensure model is registered
import mongoose from "mongoose";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import connectDB from "../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const sortParam = (searchParams.get("sort") || "createdAt:desc").trim();

    const [sortField, sortDirRaw] = sortParam.split(":");
    const sort: Record<string, 1 | -1> = {
      [sortField || "createdAt"]: sortDirRaw === "asc" ? 1 : -1,
    };

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { fullname: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const pipeline: mongoose.PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: "bookings", 
          localField: "_id",
          foreignField: "userId",
          as: "bookings",
        },
      },
      { $addFields: { totalBookings: { $size: "$bookings" } } },
      { $project: { bookings: 0 } }, 
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ];

    const [users, total] = await Promise.all([
      User.aggregate(pipeline),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      message: "Users fetched successfully",
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error("Admin users GET error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
