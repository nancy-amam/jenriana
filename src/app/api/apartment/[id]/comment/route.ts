/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import { activityService } from "@/app/api/services/activity.service";
import Apartment from "@/models/apartment";
import Feedback from "@/models/feedback";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteContext) {
  await connectDB();

  try {
    const { id } = await params;

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return NextResponse.json(
        { message: "Apartment not found" },
        { status: 404 }
      );
    }

    const { comment, rating } = await req.json();
    if (!comment || !rating) {
      return NextResponse.json(
        { message: "Comment and rating are required" },
        { status: 400 }
      );
    }

    await Feedback.create({
      userId: user.id,
      apartmentId: id,
      comment,
      rating,
    });

    await activityService.saveActivity(
      "REVIEW_ADDED",
      `Review added on :${rating}-star on ${apartment.name} `
    );

    return NextResponse.json(
      { success: true, message: "Feedback added and rating updated" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: RouteContext) {
  await connectDB();

  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: apartmentId } = await params;
    console.log("Received apartment ID:", apartmentId);

    const feedbackList = await Feedback.find({ apartmentId })
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 });

    if (feedbackList.length === 0) {
      return NextResponse.json(
        { success: false, message: "No feedback found for this apartment" },
        { status: 404 }
      );
    }

    const avgRating =
      feedbackList.reduce((sum, fb) => sum + fb.rating, 0) /
      feedbackList.length;

    await Apartment.findByIdAndUpdate(apartmentId, {
      averageRating: parseFloat(avgRating.toFixed(2)),
    });

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
