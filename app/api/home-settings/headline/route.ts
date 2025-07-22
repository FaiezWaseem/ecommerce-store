import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET - Fetch all headline messages
export async function GET() {
  try {

    const headlineMessages = await prisma.headlineMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(headlineMessages)
  } catch (error) {
    console.error('Error fetching headline messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new headline message
export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()
    
    const headlineMessage = await prisma.headlineMessage.create({
      data: {
        message: data.message,
        type: data.type || 'INFO',
        isActive: data.isActive ?? true,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      }
    })

    return NextResponse.json(headlineMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating headline message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}