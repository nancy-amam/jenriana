import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const { firstName, lastName, phone, dateOfBirth, membershipTier } = await req.json();
    console.log(firstName, lastName);

    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        membershipTier,
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Profile updated",
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating profile" }, { status: 500 });
  }
}
