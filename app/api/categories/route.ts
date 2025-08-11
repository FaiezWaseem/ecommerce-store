import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/middleware';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  parentId: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    const [categories, total] = await Promise.all([
      db.category.findMany({
        where,
        include: {
          parent: {
            select: {
              id: true,
              name: true,
            },
          },
          children: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      db.category.count({ where }),
    ]);
    
    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);
    
    // Check if slug already exists
    const existingCategory = await db.category.findUnique({
      where: { slug: validatedData.slug },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Check if name already exists
    const existingName = await db.category.findUnique({
      where: { name: validatedData.name },
    });
    
    if (existingName) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }
    
    // If parentId is provided, check if parent exists
    if (validatedData.parentId) {
      const parentCategory = await db.category.findUnique({
        where: { id: validatedData.parentId },
      });
      
      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        );
      }
    }
    
    const category = await db.category.create({
      data: validatedData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.format() },
        { status: 400 }
      );
    }
    
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}