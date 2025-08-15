/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/apartments/[id]/route.ts

import { NextResponse } from "next/server";
import Apartment from "@/models/apartment";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import mongoose from "mongoose";
import { uploadToPinata } from "../../lib/pinata";

// Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await connectDB();
    
    // Await params to get the actual values
    const { id } = await params;
    
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    // Find existing apartment
    const existingApartment = await Apartment.findById(id);
    if (!existingApartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    // Prepare update object (only set values if provided)
    const updateData: any = {};

    if (formData.has("name")) updateData.name = formData.get("name") as string;
    if (formData.has("location")) updateData.location = formData.get("location") as string;
    if (formData.has("address")) updateData.address = formData.get("address") as string;
    if (formData.has("pricePerNight")) updateData.pricePerNight = Number(formData.get("pricePerNight"));
    if (formData.has("rooms")) updateData.rooms = Number(formData.get("rooms"));
    if (formData.has("bathrooms")) updateData.bathrooms = Number(formData.get("bathrooms"));
    if (formData.has("maxGuests")) updateData.maxGuests = Number(formData.get("maxGuests"));
    if (formData.has("isTrending")) updateData.isTrending = formData.get("isTrending") === "true";

    if (formData.has("features")) updateData.features = formData.getAll("features") as string[];
    if (formData.has("rules")) updateData.rules = formData.getAll("rules") as string[];

    // Handle gallery uploads (merge with existing)
    const galleryFiles = formData.getAll("gallery") as File[];
    if (galleryFiles.length > 0) {
      const newGalleryUrls: string[] = [];
      for (const file of galleryFiles) {
        const url = await uploadToPinata(file);
        newGalleryUrls.push(url);
      }
      updateData.gallery = [
        ...(existingApartment.gallery || []), // keep old images
        ...newGalleryUrls // add new images
      ];
    }

    // Update apartment
    const updated = await Apartment.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating apartment:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  await connectDB();

  // Await params to get the actual values
  const { id } = await params;

  const user = await getUserFromRequest();
  if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await Apartment.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Apartment deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: RouteContext) {
  await connectDB();

  // Await params to get the actual values
  const { id } = await params;

  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const skip = (page - 1) * limit;

    const apartmentWithFeedback = await Apartment.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "apartmentId",
          as: "feedbacks"
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$feedbacks" }, 0] },
              { $avg: "$feedbacks.rating" },
              null
            ]
          },
          feedbackCount: { $size: "$feedbacks" },
          feedbacks: { $slice: ["$feedbacks", skip, limit] }
        }
      }
    ]);

    if (!apartmentWithFeedback.length) {
      return NextResponse.json({ success: false, message: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      page,
      limit,
      totalFeedbacks: apartmentWithFeedback[0].feedbackCount,
      data: apartmentWithFeedback[0]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}