/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import connectDB from "../lib/mongodb";
import Apartment from "@/models/apartment";
import { uploadToPinata } from "../lib/pinata";

// ================= GET all apartments =================
// export async function GET() {
//   await connectDB();

//   try {
//     const apartments = await Apartment.find().sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, data: apartments });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  await connectDB();

  try {
    const apartments = await Apartment.find()
      .sort({ createdAt: -1 })
      .lean(); // .lean() makes data plain JS objects for faster read operations

    const apartmentsWithRatings = apartments.map((apt) => {
      const ratings = apt.ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        ...apt,
        averageRating: parseFloat(avgRating.toFixed(2)), // 2 decimal places
      };
    });

    return NextResponse.json({ success: true, data: apartmentsWithRatings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// ================= CREATE new apartment =================
export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    // Map frontend fields to variables
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const address = formData.get("address") as string;
    const pricePerNight = Number(formData.get("pricePerNight"));
    const rooms = Number(formData.get("rooms"));
    const bathrooms = Number(formData.get("bathrooms"));
    const maxGuests = Number(formData.get("maxGuests"));
    const isTrending = formData.get("isTrending") === "true";

    // Arrays
    const features = formData.getAll("features") as string[];
    const rules = formData.getAll("rules") as string[];

    // Upload gallery images to Pinata
    const galleryFiles = formData.getAll("gallery") as File[];
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const url = await uploadToPinata(file);
      galleryUrls.push(url);
    }

    // Create apartment in DB
    const apartment = await Apartment.create({
      name,
      location,
      address,
      pricePerNight,
      rooms,
      bathrooms,
      maxGuests,
      isTrending,
      features,
      rules,
      gallery: galleryUrls,
    });

    return NextResponse.json(
      { success: true, data: apartment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
