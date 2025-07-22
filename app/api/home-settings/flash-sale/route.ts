import { NextRequest, NextResponse } from 'next/server'

import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// Define the enum locally to match the Prisma schema
enum PromotionType {
  REGULAR = 'REGULAR',
  FLASH_SALE = 'FLASH_SALE'
}

// GET /api/home-settings/flash-sale
export async function GET() {
  try {
    // Get all promotion products that are flash sale products
    const flashSaleProducts = await prisma.promotionProduct.findMany({
      where: {
        type: PromotionType.FLASH_SALE
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            regularPrice: true,
            salePrice: true,
            slug : true,
            images: {
              take: 1,
              select: {
                url: true
              }
            }
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json(flashSaleProducts)
  } catch (error) {
    console.error('Error fetching flash sale products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flash sale products' },
      { status: 500 }
    )
  }
}

// POST /api/home-settings/flash-sale
export async function POST(request: NextRequest) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is already in flash sale
    const existingPromotion = await prisma.promotionProduct.findFirst({
      where: {
        productId,
        type: PromotionType.FLASH_SALE
      }
    })

    if (existingPromotion) {
      return NextResponse.json(
        { error: 'Product is already in flash sale' },
        { status: 400 }
      )
    }

    // Get the highest sort order
    const highestSortOrder = await prisma.promotionProduct.findFirst({
      where: {
        type: PromotionType.FLASH_SALE
      },
      orderBy: {
        sortOrder: 'desc'
      },
      select: {
        sortOrder: true
      }
    })

    // Create new promotion product for flash sale
    const newFlashSaleProduct = await prisma.promotionProduct.create({
      data: {
        productId,
        type: PromotionType.FLASH_SALE,
        isActive: true,
        sortOrder: highestSortOrder ? highestSortOrder.sortOrder + 1 : 1
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            regularPrice: true,
            salePrice: true,
            images: {
              take: 1,
              select: {
                url: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(newFlashSaleProduct)
  } catch (error) {
    console.error('Error adding flash sale product:', error)
    return NextResponse.json(
      { error: 'Failed to add flash sale product' },
      { status: 500 }
    )
  }
}