/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Apartment from "@/models/apartment";
import Booking from "@/models/bookings";
import connectDB from "../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const status = searchParams.get("status") || "active";

    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests"); 

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    
    const query: any = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (status) {
      query.status = status;
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) }; 
    }

    
    let bookedApartmentIds: string[] = [];
    if (checkIn && checkOut) {
      const bookings = await Booking.find({
        status: "confirmed",
        $or: [
          {
            checkInDate: { $lt: new Date(checkOut) },
            checkOutDate: { $gt: new Date(checkIn) },
          },
        ],
      }).select("apartmentId");

      bookedApartmentIds = bookings.map((b) => b.apartmentId.toString());
      if (bookedApartmentIds.length > 0) {
        query._id = { $nin: bookedApartmentIds };
      }
    }

    
    const apartments = await Apartment.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Apartment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      apartments,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch apartments" },
      { status: 500 }
    );
  }
}
