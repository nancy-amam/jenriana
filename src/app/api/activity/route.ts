/* eslint-disable @typescript-eslint/no-explicit-any */
// controllers/activity.controller.ts
import { NextResponse } from "next/server";
import { activityService } from "../services/activity.service";

export async function GET() {
  try {
    const activities = await activityService.getRecentActivities(5);
    return NextResponse.json({
      message: "Recent activities fetched",
      activities,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching activities", error: error.message },
      { status: 500 }
    );
  }
}
