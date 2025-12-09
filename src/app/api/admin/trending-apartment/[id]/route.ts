import { NextResponse } from "next/server";
import connectDB from "@/app/api/lib/mongodb";

import { getUserFromRequest } from "@/app/api/lib/getUserFromRequest";
import { TrendingApartment } from "@/models/tending-apartment";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();
    const id = (await params).id;
    const user = await getUserFromRequest();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deleted = await TrendingApartment.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trending apartment removed" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}
