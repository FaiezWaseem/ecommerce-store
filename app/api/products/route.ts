import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireRole } from '@/lib/middleware';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  regularPrice: z.number().positive('Regular price must be positive'),
  salePrice: z.number().nonnegative().optional().nullable(),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'ON_BACKORDER']).default('IN_STOCK'),
  stockQuantity: z.number().int().min(0).optional(),
  manageStock: z.boolean().default(false),
  isVirtual: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  enableReviews: z.boolean().default(true),
  featuredVideoType: z.enum(['UPLOAD', 'LINK']).default('UPLOAD').optional(),
  featuredVideoLink: z.string().optional().nullable().or(z.literal('')),
  featuredVideoFile: z.string().optional().nullable().or(z.literal('')),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean().default(false),
    sortOrder: z.number().int().default(0)
  })).optional(),
});

// GET /api/products - Get all products with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (status) {
      where.status = status;
    }
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Check if SKU already exists (if provided)
    if (validatedData.sku) {
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
    
    // Handle image creation if provided
    const { images, ...productData } = validatedData;
    
    const product = await prisma.$transaction(async (tx : any) => {
      // Create product
      const newProduct = await tx.product.create({
        data: productData,
      });

      // Create images if provided
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((image, index) => ({
            productId: newProduct.id,
            url: image.url,
            alt: image.alt || '',
            isMain: index === 0, // First image is main
            sortOrder: image.sortOrder || index,
          })),
        });
      }

      // Return product with images
      return await tx.product.findUnique({
        where: { id: newProduct.id },
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
      data: product,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.format() },
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
    
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}