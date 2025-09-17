/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../lib/mongodb";
import { getUserFromRequest } from "../lib/getUserFromRequest";
import Apartment from "@/models/apartment"; 
import User from "@/models/user";
import { Favorite } from "@/models/favourite"; 

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await getUserFromRequest();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { apartmentId } = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { favorites: apartmentId } },
      { new: true }
    ).populate("favorites");

    return NextResponse.json({
      success: true,
      message: "Favorite added",
      favorites: updatedUser?.favorites,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const user = await getUserFromRequest();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Fetch user with favorites populated
  const populatedUser = await User.findById(user._id)
    .populate("favorites") // bring in apartment details
    .lean();

  return NextResponse.json({ favorites: populatedUser?.favorites || [] });
}