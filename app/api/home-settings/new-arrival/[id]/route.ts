import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from '@/lib/db'
import { z } from "zod";

const newArrivalSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  type: z.enum(["PLAYSTATION", "WOMENS_COLLECTION", "SPEAKERS", "PERFUME", "CUSTOM"]),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newArrivalSection = await prisma.newArrivalSection.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!newArrivalSection) {
      return NextResponse.json(
        { error: "New arrival section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(newArrivalSection);
  } catch (error) {
    console.error("Error fetching new arrival section:", error);
    return NextResponse.json(
      { error: "Failed to fetch new arrival section" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = newArrivalSectionSchema.parse(body);

    const updatedNewArrivalSection = await prisma.newArrivalSection.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedNewArrivalSection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error updating new arrival section:", error);
    return NextResponse.json(
      { error: "Failed to update new arrival section" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the new arrival section exists
    const existingSection = await prisma.newArrivalSection.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingSection) {
      return NextResponse.json(
        { error: "New arrival section not found" },
        { status: 404 }
      );
    }

    await prisma.newArrivalSection.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "New arrival section deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting new arrival section:", error);
    return NextResponse.json(
      { error: "Failed to delete new arrival section" },
      { status: 500 }
    );
  }
}