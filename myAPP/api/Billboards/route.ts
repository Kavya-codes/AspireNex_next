import { db } from "@/lib/db";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Function to handle S3 image upload
async function uploadImageToS3(imageData: any, imageName: string) {
  const bufferData = imageData;
  const uniqueId = Math.random().toString(36).substring(7);
  const s3Params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `billboards/${imageName}-${uniqueId}`,
    Body: bufferData,
    ContentType: "image/jpeg",
  };

  const s3Command = new PutObjectCommand(s3Params);
  await s3Client.send(s3Command);

  return `billboards/${imageName}-${uniqueId}`;
}

// Handler for creating a new billboard entry
export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Access denied", status: 401 });
  }

  try {
    const formData = await req.formData();
    const imageFile: File | null = formData.get("file") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No file provided", status: 400 });
    }

    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadedFileName = await uploadImageToS3(fileBuffer, imageFile.name);

    const billboardInfo = formData.get("billboard") as string;
    const parsedInfo = JSON.parse(billboardInfo);
    const title = parsedInfo;

    if (!title || title.length < 4) {
      return NextResponse.json({ error: "Incomplete data", status: 400 });
    }

    const newBillboard = await db?.billboard.create({
      data: {
        billboard: title,
        imageURL: uploadedFileName,
      },
    });

    return NextResponse.json({ message: "Billboard created successfully", newBillboard });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" });
  }
}

// Handler for retrieving all billboard entries
export async function GET(req: Request) {
  try {
    const billboards = await db.billboard.findMany();
    return NextResponse.json(billboards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve billboards", status: 500 });
  }
}
