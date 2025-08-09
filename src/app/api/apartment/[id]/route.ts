/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/apartments/[id]/route.ts

import { NextResponse } from "next/server";
import Apartment from "@/models/apartment";
import connectDB from "../../lib/mongodb";

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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    await Apartment.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Apartment deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
