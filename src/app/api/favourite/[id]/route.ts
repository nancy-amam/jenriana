/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import { Favorite } from "@/models/favourite";
import { getUserFromRequest } from "../../lib/getUserFromRequest";
import User from "@/models/user";

export async function DELETE(req: NextRequest) {
  await connectDB();
  const user = await getUserFromRequest();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { apartmentId } = await req.json();

  try {
    
    const foundUser = await User.findById(user._id).select("favorites");
    if (!foundUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFavorite = foundUser.favorites.some(
      (fav: any) => fav.toString() === apartmentId
    );

    if (!isFavorite) {
      return NextResponse.json(
        { error: "Apartment is not in favorites" },
        { status: 400 }
      );
    }

    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { favorites: apartmentId } },
      { new: true }
    ).populate("favorites");

    return NextResponse.json({
      success: true,
      message: "Favorite removed",
      favorites: updatedUser?.favorites,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
