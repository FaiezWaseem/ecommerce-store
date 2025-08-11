import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'

import { requireRole } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
     requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    // Get recent orders with user information
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Format the orders for the dashboard
    const formattedOrders = recentOrders.map((order: any) => ({
      id: order.id,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      customerEmail: order.user.email,
      amount: Number(order.total),
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString()
    }))

    return NextResponse.json(formattedOrders)

  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}