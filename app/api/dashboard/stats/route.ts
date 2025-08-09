import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'

import { requireRole } from '@/lib/middleware';
import { OrderStatus, ProductStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
     requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    // Get current date and calculate date ranges
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get total revenue (sum of all completed orders)
    const totalRevenueResult : any = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "DELIVERED"
      }
    })

    // Get current month revenue
    const currentMonthRevenueResult : any = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: currentMonth
        }
      }
    })

    // Get last month revenue
    const lastMonthRevenueResult : any = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: lastMonth,
          lte: lastMonthEnd
        }
      }
    })

    // Get total orders count
    const totalOrders = await prisma.order.count()

    // Get current month orders
    const currentMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: currentMonth
        }
      }
    })

    // Get last month orders
    const lastMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: lastMonth,
          lte: lastMonthEnd
        }
      }
    })

    // Get total products count
    const totalProducts = await prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE
      }
    })

    // Get current month products
    const currentMonthProducts = await prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE, 
        createdAt: {
          gte: currentMonth
        }
      }
    })

    // Get last month products
    const lastMonthProducts = await prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE,
        createdAt: {
          gte: lastMonth,
          lte: lastMonthEnd
        }
      }
    })

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: {
        isActive: true
      }
    })

    // Get current month users
    const currentMonthUsers = await prisma.user.count({
      where: {
        isActive: true,
        createdAt: {
          gte: currentMonth
        }
      }
    })

    // Get last month users
    const lastMonthUsers = await prisma.user.count({
      where: {
        isActive: true,
        createdAt: {
          gte: lastMonth,
          lte: lastMonthEnd
        }
      }
    })

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    
    const totalRevenue = totalRevenueResult._sum.total || 0
    const currentMonthRevenue = currentMonthRevenueResult._sum.total || 0
    const lastMonthRevenue = lastMonthRevenueResult._sum.total || 0

    const revenueChange = calculateChange(currentMonthRevenue, lastMonthRevenue)
    const ordersChange = calculateChange(currentMonthOrders, lastMonthOrders)
    const productsChange = calculateChange(currentMonthProducts, lastMonthProducts)
    const usersChange = calculateChange(currentMonthUsers, lastMonthUsers)

    const stats = {
      totalRevenue: Number(totalRevenue),
      totalOrders,
      totalProducts,
      totalUsers,
      revenueChange: Number(revenueChange.toFixed(1)),
      ordersChange: Number(ordersChange.toFixed(1)),
      productsChange: Number(productsChange.toFixed(1)),
      usersChange: Number(usersChange.toFixed(1))
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error'},
      { status: 500 }
    )
  }
}