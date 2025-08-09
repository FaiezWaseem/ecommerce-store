export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'

// GET - Fetch home page data for frontend
export async function GET() {
  try {
    // Ensure database connection
    await prisma.$connect();

    // Fetch home page settings
    let settings = await prisma.homePageSettings.findFirst()

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.homePageSettings.create({
        data: {
          topBannerEnabled: true,
          topBannerText: 'Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!',
          topBannerLink: '/products',
          topBannerLinkText: 'ShopNow',
          heroSectionEnabled: true,
          categoriesEnabled: true,
          flashSaleEnabled: true,
          bestSellingEnabled: true,
          featuredBannerEnabled: true,
          exploreProductsEnabled: true,
          newArrivalEnabled: true,
          servicesEnabled: true
        }
      })
    }

    // Fetch active carousel banners
    const carouselBanners = await prisma.carouselBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    // Fetch active promotional banners
    const promotionalBanners = await prisma.promotionalBanner.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
      orderBy: { sortOrder: 'asc' }
    })

    // Fetch active featured sections
    const featuredSections = await prisma.featuredSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    // Fetch active headline messages
    const headlineMessages = await prisma.headlineMessage.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch active sale banners
    const saleBanners = await prisma.saleBanner.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch categories for dynamic category section
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      take: 10
    })

    // Fetch products for various sections
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK'
      },
      include: {
        images: true,
        category: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Fetch best selling products (based on order count - simplified)
    const bestSellingProducts = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK'
      },
      include: {
        images: true,
        category: true,
        _count: {
          select: { orderItems: true }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 8
    })

    return NextResponse.json({
      settings,
      carouselBanners,
      promotionalBanners,
      featuredSections,
      headlineMessages,
      saleBanners,
      categories,
      products,
      bestSellingProducts
    })
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}