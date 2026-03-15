import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import Apartment from "@/models/apartment";

export async function GET() {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "partner") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const apartments = await Apartment.find({ ownerId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const list = apartments.map((a) => ({
      _id: a._id.toString(),
      name: a.name,
      location: a.location ?? "",
      address: a.address,
      pricePerNight: a.pricePerNight ?? 0,
      rooms: a.rooms ?? 0,
      bathrooms: a.bathrooms ?? 0,
      maxGuests: a.maxGuests ?? 0,
      gallery: a.gallery ?? [],
      status: a.status ?? "active",
      features: a.features ?? [],
      rules: a.rules ?? [],
      description: a.description,
      occupied: false,
    }));

    return NextResponse.json({ apartments: list });
  } catch (err) {
    console.error("Partner apartments list error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
