/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Feedback from "@/models/feedback";
import { getUserFromRequest } from "../../lib/getUserFromRequest";

// Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  await connectDB();

  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingFeedback = await Feedback.findById(id);
    if (!existingFeedback) {
      return NextResponse.json({ message: "Feedback not found" }, { status: 404 });
    }
    
    // Allow owner or admin
    if (existingFeedback.userId.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { comment, rating } = await req.json();

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      {
        ...(comment && { comment }),
        ...(rating && { rating }),
        updated: true,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedFeedback }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  await connectDB();

  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json({ message: "Feedback not found" }, { status: 404 });
    }

    // Allow owner or admin
    if (feedback.userId.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await feedback.deleteOne();

    return NextResponse.json({ success: true, message: "Feedback deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}