// lib/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.S3_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!bucket || !accessKeyId || !secretAccessKey) {
  console.warn(
    "S3 upload: Missing env (S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY). Image uploads will fail."
  );
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

/** Accept File or Blob (e.g. from FormData in some runtimes) */
export async function uploadToS3(file: File | Blob & { name?: string }): Promise<string> {
  if (!bucket) {
    throw new Error(
      "S3 is not configured. Set S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env"
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = "name" in file && typeof file.name === "string" ? file.name : "image";
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `apartments/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  const contentType =
    "type" in file && typeof file.type === "string" && file.type
      ? file.type
      : "application/octet-stream";

  const publicBase =
    process.env.S3_PUBLIC_BASE_URL ||
    `https://${bucket}.s3.${region}.amazonaws.com`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${publicBase}/${key}`;
}
