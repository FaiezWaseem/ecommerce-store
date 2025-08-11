import { NextRequest, NextResponse } from 'next/server'

import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware';

// PUT - Update carousel banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()
    const { id } = params
    
    const carouselBanner = await prisma.carouselBanner.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        image: data.image,
        logoImage: data.logoImage,
        bgColor: data.bgColor,
        textColor: data.textColor,
        isActive: data.isActive,
        position: data.position,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(carouselBanner)
  } catch (error) {
    console.error('Error updating carousel banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete carousel banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const { id } = params
    
    await prisma.carouselBanner.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Carousel banner deleted successfully' })
  } catch (error) {
    console.error('Error deleting carousel banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}