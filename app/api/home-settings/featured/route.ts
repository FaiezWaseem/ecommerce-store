import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'
// GET - Fetch all featured sections
export async function GET() {
  try {


    const featuredSections = await prisma.featuredSection.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(featuredSections)
  } catch (error) {
    console.error('Error fetching featured sections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new featured section
export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()

    // Get the next sort order
    const lastSection = await prisma.featuredSection.findFirst({
      orderBy: { sortOrder: 'desc' }
    })
    const nextSortOrder = lastSection ? lastSection.sortOrder + 1 : 1

    const featuredSection = await prisma.featuredSection.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        image: data.image,
        bgColor: data.bgColor || '#000000',
        textColor: data.textColor || '#ffffff',
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        countdown: data.countdown ?? false,
        countdownEnd: data.countdownEnd ? new Date(data.countdownEnd) : null,
        type: data.type || 'CUSTOM',
        isActive: data.isActive ?? true,
        sortOrder: nextSortOrder
      }
    })

    return NextResponse.json(featuredSection, { status: 201 })
  } catch (error) {
    console.error('Error creating featured section:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}