import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const s3 = new S3Client({ forcePathStyle: true }); // endpoint/keys/region come from AWS_* env vars
const Bucket = process.env.S3_BUCKET!;

// Images are served through /api/img (no permanent public bucket URL); the app URL is what we store.
export async function uploadImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  await s3.send(new PutObjectCommand({ Bucket, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type || "image/jpeg" }));
  return `/api/img/${key}`;
}

export async function getImage(key: string) {
  return s3.send(new GetObjectCommand({ Bucket, Key: key }));
}
