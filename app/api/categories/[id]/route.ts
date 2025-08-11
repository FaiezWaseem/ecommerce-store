import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/middleware';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  slug: z.string().min(1, 'Category slug is required').optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { id: params.id },
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
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);
    
    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id: params.id },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if slug already exists (if updating slug)
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await db.category.findUnique({
        where: { slug: validatedData.slug },
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Check if name already exists (if updating name)
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const nameExists = await db.category.findUnique({
        where: { name: validatedData.name },
      });
      
      if (nameExists) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // If parentId is provided, check if parent exists and prevent circular reference
    if (validatedData.parentId) {
      if (validatedData.parentId === params.id) {
        return NextResponse.json(
          { error: 'Category cannot be its own parent' },
          { status: 400 }
        );
      }
      
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
    
    const updatedCategory = await db.category.update({
      where: { id: params.id },
      data: validatedData,
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
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    
    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated products' },
        { status: 400 }
      );
    }
    
    // Check if category has children
    if (existingCategory._count.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }
    
    await db.category.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}