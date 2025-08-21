import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// PUT - Update featured section
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()
    const { id } = params

    const featuredSection = await prisma.featuredSection.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        image: data.image,
        bgColor: data.bgColor,
        textColor: data.textColor,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        countdown: data.countdown,
        countdownEnd: data.countdownEnd ? new Date(data.countdownEnd) : null,
        type: data.type,
        isActive: data.isActive,
        sortOrder: data.sortOrder
      }
    })

    return NextResponse.json(featuredSection)
  } catch (error) {
    console.error('Error updating featured section:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete featured section
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const { id } = params

    // Check if featured section exists
    const existingSection = await prisma.featuredSection.findUnique({
      where: { id }
    })

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Featured section not found' },
        { status: 404 }
      )
    }

    // Delete featured section
    await prisma.featuredSection.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting featured section:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}