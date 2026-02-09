// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { uploadToS3 } from "../lib/s3";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const url = await uploadToS3(file);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
