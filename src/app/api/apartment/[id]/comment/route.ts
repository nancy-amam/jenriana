/* eslint-disable @typescript-eslint/no-explicit-any */
import eventBus from "@/app/api/lib/eventBus";
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import Apartment from "@/models/apartment";
import Feedback from "@/models/feedback";
import { NextResponse } from "next/server";

// Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(req: Request, { params }: RouteContext) {
  await connectDB();

  try {
    // Await params to get the actual values
    const { id } = await params;
    
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json({ message: "Apartment not found" }, { status: 404 });
    }

    const { comment, rating } = await req.json();
    if (!comment || !rating) {
      return NextResponse.json({ message: "Comment and rating are required" }, { status: 400 });
    }

    // Save feedback
    await Feedback.create({
      userId: user.id,
      apartmentId: id,
      comment,
      rating,
    });

        eventBus.emit("activity", {
      type: "NEW_REVIEW",
      message: `Review added on :${rating}-star on ${apartment.name} `,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Feedback added and rating updated" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: RouteContext
) {
  await connectDB();

  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Await params to get the actual values
    const { id: apartmentId } = await params;
    console.log("Received apartment ID:", apartmentId);

    // 1. Get all feedback for this apartment
    const feedbackList = await Feedback.find({ apartmentId })
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 });

    if (feedbackList.length === 0) {
      return NextResponse.json(
        { success: false, message: "No feedback found for this apartment" },
        { status: 404 }
      );
    }

    // 2. Calculate average rating
    const avgRating =
      feedbackList.reduce((sum, fb) => sum + fb.rating, 0) /
      feedbackList.length;

    // 3. Update the apartment's average rating
    await Apartment.findByIdAndUpdate(apartmentId, {
      averageRating: parseFloat(avgRating.toFixed(2)),
    });

    // 4. Return feedback and average
    return NextResponse.json(
      {
        success: true,
        averageRating: parseFloat(avgRating.toFixed(2)),
        comments: feedbackList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching apartment comments:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}