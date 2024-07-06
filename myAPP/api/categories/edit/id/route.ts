import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Function to retrieve a specific category by ID
export async function fetchCategoryById(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Access denied", status: 401 });
    }

    const categoryDetails = await db.category.findUnique({
      where: { id },
    });

    return NextResponse.json(categoryDetails);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category", status: 500 });
  }
}

// Function to update category details
export async function updateCategoryDetails(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Access denied", status: 401 });
    }

    const requestData = await req.json();
    const { category, billboard } = requestData;

    const updatedData = { category, billboard };
    const updatedCategory = await db.category.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category", status: 500 });
  }
}

// Function to delete a category and its associated sizes
export async function removeCategory(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Access denied", status: 401 });
    }

    const associatedSizes = await db.categorySize.findMany({
      where: { categoryId: id },
    });

    await Promise.all(
      associatedSizes.map(async (size) => {
        await db.categorySize.delete({ where: { id: size.id } });
      })
    );

    const deletedCategory = await db.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category", status: 500 });
  }
}
