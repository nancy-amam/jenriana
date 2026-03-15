import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { getUserFromRequest } from "../../../lib/getUserFromRequest";
import Apartment from "@/models/apartment";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "partner") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const apartment = await Apartment.findOne({
      _id: id,
      ownerId: user._id,
    }).lean();

    if (!apartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: apartment._id.toString(),
      name: apartment.name,
      location: apartment.location ?? "",
      address: apartment.address,
      pricePerNight: apartment.pricePerNight ?? 0,
      rooms: apartment.rooms ?? 0,
      bathrooms: apartment.bathrooms ?? 0,
      maxGuests: apartment.maxGuests ?? 0,
      gallery: apartment.gallery ?? [],
      status: apartment.status ?? "active",
      features: apartment.features ?? [],
      rules: apartment.rules ?? [],
      description: apartment.description,
      occupied: false,
    });
  } catch (err) {
    console.error("Partner apartment by id error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
