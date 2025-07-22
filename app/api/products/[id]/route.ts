import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireRole } from '@/lib/middleware';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  slug: z.string().min(1, 'Product slug is required').optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  regularPrice: z.number().positive('Regular price must be positive').optional(),
  salePrice: z.number().positive().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'ON_BACKORDER']).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  manageStock: z.boolean().optional(),
  isVirtual: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  enableReviews: z.boolean().optional(),
  featuredVideoType: z.enum(['UPLOAD', 'LINK']).optional(),
  featuredVideoLink: z.string().nullable().optional(),
  featuredVideoFile: z.string().nullable().optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean().default(false),
    sortOrder: z.number().int().default(0)
  })).optional(),
});

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (if updating slug)
    if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Check if SKU already exists (if updating SKU)
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (existingSku) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 409 }
        );
      }
    }

    // Handle image updates if provided
    const { images, ...productData } = validatedData;
    
    const updatedProduct = await prisma.$transaction(async (tx : any) => {
      // Update product data
      const product = await tx.product.update({
        where: { id: params.id },
        data: {
          ...productData,
          updatedAt: new Date(),
        },
      });

      // Handle images if provided
      if (images) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId: params.id },
        });

        // Create new images
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((image, index) => ({
              productId: params.id,
              url: image.url,
              alt: image.alt || '',
              isMain: index === 0, // First image is main
              sortOrder: image.sortOrder || index,
            })),
          });
        }
      }

      // Return updated product with images
      return await tx.product.findUnique({
        where: { id: params.id },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            images: true,
          },
        },
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product has associated orders
    if (existingProduct._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider archiving instead.' },
        { status: 409 }
      );
    }

    // Delete associated data first
    await prisma.$transaction([
      // Delete product images
      prisma.productImage.deleteMany({
        where: { productId: params.id },
      }),
      // Delete product reviews
      prisma.review.deleteMany({
        where: { productId: params.id },
      }),
      // Delete the product
      prisma.product.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}