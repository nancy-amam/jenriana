/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../lib/mongodb";
import Apartment, { IAddon } from "@/models/apartment";
import { uploadToPinata } from "../lib/pinata";
import { getUserFromRequest } from "../lib/getUserFromRequest";
import { activityService } from "../services/activity.service";

export async function GET() {
  await connectDB();

  try {
    const apartments = await Apartment.aggregate([
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "apartmentId",
          as: "feedbacks",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$feedbacks" }, 0] },
              { $avg: "$feedbacks.rating" },
              0,
            ],
          },
          feedbackCount: { $size: "$feedbacks" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          feedbacks: 0,
        },
      },
    ]);

    return NextResponse.json({ success: true, data: apartments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const address = formData.get("address") as string;
    const pricePerNight = Number(formData.get("pricePerNight"));
    const rooms = Number(formData.get("rooms"));
    const bathrooms = Number(formData.get("bathrooms"));
    const maxGuests = Number(formData.get("maxGuests"));
    const isTrending = formData.get("isTrending") === "true";

    const features = formData.getAll("features") as string[];
    const rules = formData.getAll("rules") as string[];

    const galleryFiles = formData.getAll("gallery") as File[];
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const url = await uploadToPinata(file);
      galleryUrls.push(url);
    }
    const addons = JSON.parse(formData.get("addons") as string) as IAddon[];
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
      addons,
      status: "active",
    });

    await activityService.saveActivity(
      "APPPARTEMNT_ADDED",
      `Apartment created by: ${user} `
    );

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
