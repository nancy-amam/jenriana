/* eslint-disable @typescript-eslint/no-explicit-any */
import Apartment from "@/models/apartment";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import connectDB from "../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rooms = searchParams.get("rooms");
    const features = searchParams.get("features");
    const status = searchParams.get("status");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const query: any = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (rooms) query.rooms = Number(rooms);
    if (features) query.features = { $all: features.split(",") };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [apartments, total] = await Promise.all([
      Apartment.find(query).skip(skip).limit(limit),
      Apartment.countDocuments(query),
    ]);

    return NextResponse.json({
      data: apartments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

