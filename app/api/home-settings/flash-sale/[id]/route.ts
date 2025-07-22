import { NextRequest, NextResponse } from 'next/server'

import { db as prisma } from '@/lib/db'
import { requireRole } from '@/lib/middleware'

// GET /api/home-settings/flash-sale/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const flashSaleProduct = await prisma.promotionProduct.findUnique({
      where: {
        id,
        type: 'FLASH_SALE'
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

    if (!flashSaleProduct) {
      return NextResponse.json(
        { error: 'Flash sale product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(flashSaleProduct)
  } catch (error) {
    console.error('Error fetching flash sale product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flash sale product' },
      { status: 500 }
    )
  }
}

// PUT /api/home-settings/flash-sale/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
   requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);


    const id = params.id
    const { isActive, sortOrder } = await request.json()

    // Check if flash sale product exists
    const existingProduct = await prisma.promotionProduct.findUnique({
      where: {
        id,
        type: 'FLASH_SALE'
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Flash sale product not found' },
        { status: 404 }
      )
    }

    // Update flash sale product
    const updatedFlashSaleProduct = await prisma.promotionProduct.update({
      where: { id },
      data: {
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        sortOrder: sortOrder !== undefined ? sortOrder : existingProduct.sortOrder
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

    return NextResponse.json(updatedFlashSaleProduct)
  } catch (error) {
    console.error('Error updating flash sale product:', error)
    return NextResponse.json(
      { error: 'Failed to update flash sale product' },
      { status: 500 }
    )
  }
}

// DELETE /api/home-settings/flash-sale/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);


    const id = params.id

    // Check if flash sale product exists
    const existingProduct = await prisma.promotionProduct.findUnique({
      where: {
        id,
        type: 'FLASH_SALE'
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Flash sale product not found' },
        { status: 404 }
      )
    }

    // Delete flash sale product
    await prisma.promotionProduct.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting flash sale product:', error)
    return NextResponse.json(
      { error: 'Failed to delete flash sale product' },
      { status: 500 }
    )
  }
}