import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET - Fetch all sale banners
export async function GET() {
  try {

    const saleBanners = await prisma.saleBanner.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(saleBanners)
  } catch (error) {
    console.error('Error fetching sale banners:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new sale banner
export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()

    const saleBanner = await prisma.saleBanner.create({
      data: {
        title: data.title,
        description: data.description,
        discount: data.discount,
        image: data.image,
        bgColor: data.bgColor || '#ff0000',
        textColor: data.textColor || '#ffffff',
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        isActive: data.isActive ?? true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    return NextResponse.json(saleBanner, { status: 201 })
  } catch (error) {
    console.error('Error creating sale banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}