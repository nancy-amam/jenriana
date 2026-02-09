// lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToS3(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split(".").pop() || "jpg";
  const key = `products/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  const bucket = process.env.S3_BUCKET_NAME as string;
  const publicBase =
    process.env.S3_PUBLIC_BASE_URL ||
    `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return `${publicBase}/${key}`;
}
