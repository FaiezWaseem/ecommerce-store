export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET - Fetch a specific sale banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$connect();
    const { id } = params

    const saleBanner = await prisma.saleBanner.findUnique({
      where: { id }
    })

    if (!saleBanner) {
      return NextResponse.json(
        { error: 'Sale banner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(saleBanner)
  } catch (error) {
    console.error('Error fetching sale banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update a sale banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const { id } = params
    const data = await request.json()

    // Check if sale banner exists
    const existingSaleBanner = await prisma.saleBanner.findUnique({
      where: { id }
    })

    if (!existingSaleBanner) {
      return NextResponse.json(
        { error: 'Sale banner not found' },
        { status: 404 }
      )
    }

    // Update sale banner
    const updatedSaleBanner = await prisma.saleBanner.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        discount: data.discount,
        image: data.image,
        bgColor: data.bgColor,
        textColor: data.textColor,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        isActive: data.isActive,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedSaleBanner)
  } catch (error) {
    console.error('Error updating sale banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a sale banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const { id } = params

    // Check if sale banner exists
    const existingSaleBanner = await prisma.saleBanner.findUnique({
      where: { id }
    })

    if (!existingSaleBanner) {
      return NextResponse.json(
        { error: 'Sale banner not found' },
        { status: 404 }
      )
    }

    // Delete sale banner
    await prisma.saleBanner.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Sale banner deleted successfully' })
  } catch (error) {
    console.error('Error deleting sale banner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}