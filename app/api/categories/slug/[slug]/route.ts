import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await db.$connect();
    const category = await db.category.findUnique({
      where: { 
        slug: params.slug,
        isActive: true // Only return active categories
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE'
              }
            },
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
    
    await db.$disconnect();
    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}