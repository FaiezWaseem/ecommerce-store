import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET - Fetch all promotional banners
export async function GET() {
  try {


    const promotionalBanners = await prisma.promotionalBanner.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(promotionalBanners)
  } catch (error) {
    console.error('Error fetching promotional banners:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new promotional banner
export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()

    // Get the next sort order
    const lastBanner = await prisma.promotionalBanner.findFirst({
      orderBy: { sortOrder: 'desc' }
    })
    const nextSortOrder = lastBanner ? lastBanner.sortOrder + 1 : 1

    const promotionalBanner = await prisma.promotionalBanner.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        position: data.position || 'MIDDLE',
        isActive: data.isActive ?? true,
        sortOrder: nextSortOrder,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    return NextResponse.json(promotionalBanner, { status: 201 })
  } catch (error) {
    console.error('Error creating promotional banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}