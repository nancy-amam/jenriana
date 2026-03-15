import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

/**
 * Lightweight check: is the current user a logged-in partner?
 * Used by partner layout to redirect unauthenticated users to login.
 */
export async function GET() {
  try {
    await connectDB();
    const user = await getUserFromRequest();
    if (!user || user.role !== "partner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }
}
