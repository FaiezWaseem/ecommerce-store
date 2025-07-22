import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// PUT - Update headline message
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()
    const { id } = params

    const headlineMessage = await prisma.headlineMessage.update({
      where: { id },
      data: {
        message: data.message,
        type: data.type,
        isActive: data.isActive,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    return NextResponse.json(headlineMessage)
  } catch (error) {
    console.error('Error updating headline message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete headline message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const { id } = params

    await prisma.headlineMessage.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Headline message deleted successfully' })
  } catch (error) {
    console.error('Error deleting headline message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}