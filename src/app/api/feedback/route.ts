/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../lib/mongodb";
import Feedback from "@/models/feedback";



export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const apartmentId = searchParams.get("apartmentId");

    const query: any = {};
    if (apartmentId) query.apartmentId = apartmentId;

    const feedbacks = await Feedback.find(query)
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: feedbacks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
