import { NextRequest, NextResponse } from "next/server";

import Feedback from "@/models/feedback";
import connectDB from "@/app/api/lib/mongodb";
import GeneralFeedback from "@/models/general-feedback";

export async function POST(req: NextResponse) {
  try {
    await connectDB();
    const body = await req.json();

    const feedback = await GeneralFeedback.create({
      name: body.name,
      contact: body.contact,

      bookingProcess: body.bookingProcess,
      cleanliness: body.cleanliness,
      amenitiesComfort: body.amenitiesComfort,
      customerService: body.customerService,
      valueForMoney: body.valueForMoney,

      enjoyedMost: body.enjoyedMost,
      improvements: body.improvements,

      recommend: body.recommend,
    });

    return NextResponse.json({ message: "Feedback submitted", feedback }, { status: 201 });
  } catch (error: any) {
    console.error("Feedback error:", error);
    return NextResponse.json({ message: "Failed to submit feedback", error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const publishParam = searchParams.get("publish");

    let filter: any = {};

    if (publishParam === "true") filter.publish = true;
    if (publishParam === "false") filter.publish = false;

    const feedback = await GeneralFeedback.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch feedback" }, { status: 500 });
  }
}
