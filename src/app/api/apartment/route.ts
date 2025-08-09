/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import connectDB from '../lib/mongodb';
import Apartment from "@/models/apartment";

// GET all apartments
export async function GET() {
  await connectDB();

  try {
    const apartments = await Apartment.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: apartments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// CREATE new apartment
export async function POST(request: Request) {
  await connectDB();

  try {
    const body = await request.json();
    const apartment = await Apartment.create(body);

    return NextResponse.json({ success: true, data: apartment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
