import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET - Fetch home page settings
export async function GET() {
  try {
  

    let settings = await prisma.homePageSettings.findFirst()
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.homePageSettings.create({
        data: {
          topBannerEnabled: true,
          topBannerText: 'Summer Sale UP to 50% OFF Shopnow',
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

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching home page settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update home page settings
export async function PUT(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const data = await request.json()
    
    // Find existing settings
    const existingSettings = await prisma.homePageSettings.findFirst()
    
    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.homePageSettings.update({
        where: { id: existingSettings.id },
        data: {
          topBannerEnabled: data.topBannerEnabled,
          topBannerText: data.topBannerText,
          topBannerLink: data.topBannerLink,
          topBannerLinkText: data.topBannerLinkText,
          heroSectionEnabled: data.heroSectionEnabled,
          categoriesEnabled: data.categoriesEnabled,
          flashSaleEnabled: data.flashSaleEnabled,
          flashSaleEndTime: data.flashSaleEndTime ? new Date(data.flashSaleEndTime) : null,
          bestSellingEnabled: data.bestSellingEnabled,
          featuredBannerEnabled: data.featuredBannerEnabled,
          exploreProductsEnabled: data.exploreProductsEnabled,
          newArrivalEnabled: data.newArrivalEnabled,
          servicesEnabled: data.servicesEnabled,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new settings
      settings = await prisma.homePageSettings.create({
        data: {
          topBannerEnabled: data.topBannerEnabled,
          topBannerText: data.topBannerText,
          topBannerLink: data.topBannerLink,
          topBannerLinkText: data.topBannerLinkText,
          heroSectionEnabled: data.heroSectionEnabled,
          categoriesEnabled: data.categoriesEnabled,
          flashSaleEnabled: data.flashSaleEnabled,
          flashSaleEndTime: data.flashSaleEndTime ? new Date(data.flashSaleEndTime) : null,
          bestSellingEnabled: data.bestSellingEnabled,
          featuredBannerEnabled: data.featuredBannerEnabled,
          exploreProductsEnabled: data.exploreProductsEnabled,
          newArrivalEnabled: data.newArrivalEnabled,
          servicesEnabled: data.servicesEnabled
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating home page settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}