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

export async function GET() {
  try {
    const newArrivalSections = await prisma.newArrivalSection.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(newArrivalSections);
  } catch (error) {
    console.error("Error fetching new arrival sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch new arrival sections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newArrivalSectionSchema.parse(body);

    // Get the next sort order
    const lastSection = await prisma.newArrivalSection.findFirst({
      orderBy: { sortOrder: 'desc' }
    });
    const nextSortOrder = lastSection ? lastSection.sortOrder + 1 : 1;

    const newArrivalSection = await prisma.newArrivalSection.create({
      data: {
        ...validatedData,
        bgColor: validatedData.bgColor || '#000000',
        textColor: validatedData.textColor || '#ffffff',
        isActive: validatedData.isActive ?? true,
        sortOrder: nextSortOrder
      },
    });

    return NextResponse.json(newArrivalSection, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating new arrival section:", error);
    return NextResponse.json(
      { error: "Failed to create new arrival section" },
      { status: 500 }
    );
  }
}