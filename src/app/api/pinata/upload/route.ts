/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/pinata/upload/route.ts
import { NextResponse } from "next/server";
import { uploadToPinata } from "../../lib/pinata";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileUrl = await uploadToPinata(file);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
