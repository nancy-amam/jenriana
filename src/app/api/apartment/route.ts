/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../lib/mongodb";
import Apartment, { IAddon } from "@/models/apartment";
import { uploadToS3 } from "../lib/s3";
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

    const galleryRaw = formData.getAll("gallery");
    const galleryFiles = galleryRaw.filter(
      (f): f is File | (Blob & { name?: string }) =>
        f instanceof File || (typeof f === "object" && f !== null && "arrayBuffer" in f && typeof (f as Blob).arrayBuffer === "function")
    );
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const url = await uploadToS3(file);
      galleryUrls.push(url);
    }
    const addonsRaw = formData.get("addons");
    const addons: IAddon[] =
      addonsRaw != null && String(addonsRaw).trim() !== ""
        ? (JSON.parse(String(addonsRaw)) as IAddon[])
        : [];
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
    console.error("POST /api/apartment error:", error);
    const message =
      error.message?.includes("S3") || error.message?.includes("upload")
        ? "Image upload failed. Check S3 env vars (S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)."
        : error.message;
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
