import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// GET - Fetch all carousel banners
export async function GET() {
  try {
    await prisma.$connect();


    const carouselBanners = await prisma.carouselBanner.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(carouselBanners)
  } catch (error) {
    console.error('Error fetching carousel banners:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create new carousel banner
export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()

    // Get the next sort order
    const lastBanner = await prisma.carouselBanner.findFirst({
      orderBy: { sortOrder: 'desc' }
    })
    const nextSortOrder = lastBanner ? lastBanner.sortOrder + 1 : 1

    const carouselBanner = await prisma.carouselBanner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        image: data.image,
        logoImage: data.logoImage,
        bgColor: data.bgColor || '#000000',
        textColor: data.textColor || '#ffffff',
        isActive: data.isActive ?? true,
        sortOrder: nextSortOrder,
        position: data.position || 'CENTER'
      }
    })

    return NextResponse.json(carouselBanner, { status: 201 })
  } catch (error) {
    console.error('Error creating carousel banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}