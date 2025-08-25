/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/app/api/lib/mongodb";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { fullname, email, phone } = body;

    const updated = await User.findByIdAndUpdate(
      params.id,
      {
        ...(fullname !== undefined && { fullname }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (err: any) {
    console.error("Admin user PUT error:", err);
    if (err?.code === 11000) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const admin = await getUserFromRequest();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const deleted = await User.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin user DELETE error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
