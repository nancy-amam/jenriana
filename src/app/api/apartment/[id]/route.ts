/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/apartments/[id]/route.ts

import { NextResponse } from "next/server";
import Apartment from "@/models/apartment";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const apartment = await Apartment.findById(params.id);
    if (!apartment) {
      return NextResponse.json({ success: false, message: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: apartment });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
// /app/api/apartments/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();

  try {
    const updated = await Apartment.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    await Apartment.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Apartment deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { comment, rating } = await req.json();
    if (!comment || !rating) {
      return NextResponse.json({ message: "Comment and rating are required" }, { status: 400 });
    }

    const apartment = await Apartment.findById(params.id);
    if (!apartment) {
      return NextResponse.json({ success: false, message: "Apartment not found" }, { status: 404 });
    }

    // Add new feedback
    apartment.ratings.push({
      userId: user.id,
      comment,
      rating,
      createdAt: new Date(),
    });

    // Recalculate average rating
    const avg =
      apartment.ratings.reduce((sum, r) => sum + r.rating, 0) /
      apartment.ratings.length;
    apartment.averageRating = avg;

    await apartment.save();

    return NextResponse.json(
      { success: true, data: apartment },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
