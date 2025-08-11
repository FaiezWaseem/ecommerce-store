import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const brands = searchParams.get('brands')?.split(',').filter(Boolean);
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'newest';
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {
      status: 'ACTIVE', // Only show active products
    };
    
    // Search in name, description, and SKU
    if (search) {
      where.OR = [
        { name: { contains: search} },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
        { sku: { contains: search } },
      ];
    }
    
    // Category filter
    if (category) {
      where.categoryId = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.regularPrice = {};
      if (minPrice) {
        where.regularPrice.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.regularPrice.lte = parseFloat(maxPrice);
      }
    }
    
    // Stock filter
    if (inStock === 'true') {
      where.stockStatus = 'IN_STOCK';
    }
    
    // Brand filter (assuming brands are stored in product attributes)
    if (brands && brands.length > 0) {
      where.attributes = {
        some: {
          name: 'brand',
          value: {
            in: brands,
            mode: 'insensitive'
          }
        }
      };
    }
    
    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // default newest
    
    switch (sort) {
      case 'price-low-high':
        orderBy = { regularPrice: 'asc' };
        break;
      case 'price-high-low':
        orderBy = { regularPrice: 'desc' };
        break;
      case 'rating-high-low':
        // This would require a computed field for average rating
        // For now, we'll use featured products first, then newest
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }
    
    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
            take: 1, // Only get the main image for search results
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          attributes: {
            select: {
              name: true,
              value: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    
    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: product.reviews.length,
        reviews: undefined, // Remove reviews from response to reduce payload
      };
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}