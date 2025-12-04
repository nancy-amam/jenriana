import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

export async function PATCH(req: Request) {
  await connectDB();

  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  const { fullname, phone } = await req.json();

  const updated = await User.findByIdAndUpdate(user._id, { fullname, phone }, { new: true });

  return NextResponse.json({
    message: "Profile updated",
    user: updated,
  });
}
