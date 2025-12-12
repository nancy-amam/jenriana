import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import connectDB from "@/app/api/lib/mongodb";
import GeneralFeedback from "@/models/general-feedback";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await connectDB();

    const body = await req.json();
    const { publish } = body;

    const id = (await params).id;
    const user = await getUserFromRequest();
    if (user?.role !== "admin") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (typeof publish !== "boolean") {
      return NextResponse.json({ success: false, message: "publish must be a boolean" }, { status: 400 });
    }

    const updated = await GeneralFeedback.findByIdAndUpdate(id, { publish }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Feedback not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to update" }, { status: 500 });
  }
}
