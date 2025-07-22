import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET - Fetch a specific promotional banner
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const promotionalBanner = await prisma.promotionalBanner.findUnique({
      where: { id }
    })

    if (!promotionalBanner) {
      return NextResponse.json(
        { error: 'Promotional banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(promotionalBanner)
  } catch (error) {
    console.error('Error fetching promotional banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a promotional banner
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    
    const { id } = params
    const data = await request.json()

    const promotionalBanner = await prisma.promotionalBanner.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        position: data.position,
        isActive: data.isActive,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    return NextResponse.json(promotionalBanner)
  } catch (error) {
    console.error('Error updating promotional banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a promotional banner
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    
    const { id } = params

    await prisma.promotionalBanner.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotional banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}