import { db } from "@/lib/db";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

async function uploadImageToS3(image: any, imageName: any) {
  const imageBuffer = image;
  const uniqueSuffix = Math.random().toString(36).substring(7);
  const s3Params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `billboards/${imageName}-${uniqueSuffix}`,
    Body: imageBuffer,
    ContentType: "image/jpg",
  };

  const uploadCommand = new PutObjectCommand(s3Params);
  await s3Client.send(uploadCommand);

  return `billboards/${imageName}-${uniqueSuffix}`;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const billboard = await db.billboard.findUnique({
      where: { id },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve billboard", status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const billboardData = formData.get("billboard") as string;
    const parsedData = JSON.parse(billboardData);
    const title = parsedData;

    let imageName: string | undefined;

    if (file && file instanceof File && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageName = await uploadImageToS3(buffer, file.name);
    }

    if (!title || title.length < 4) {
      return NextResponse.json({ error: "Invalid fields", status: 400 });
    }

    const updatePayload: { billboard: string; imageURL?: string } = { billboard: title };
    if (imageName) updatePayload.imageURL = imageName;

    const updatedBillboard = await db.billboard.update({
      where: { id },
      data: updatePayload,
    });

    return NextResponse.json({ updatedBillboard, message: "Billboard updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error updating billboard", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const billboard = await db.billboard.findUnique({ where: { id } });
    const imageKey = billboard?.imageURL;
    const deletedBillboard = await db.billboard.delete({ where: { id } });

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: imageKey,
    });
    await s3Client.send(deleteCommand);

    return NextResponse.json(deletedBillboard);
  } catch (error) {
    return NextResponse.json({ error: "Error deleting billboard", status: 500 });
  }
}
