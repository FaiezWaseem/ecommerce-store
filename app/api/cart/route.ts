import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getUserById } from '@/lib/auth';
import { z } from 'zod';
import { getAuthUser } from '@/lib/middleware';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';


const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

// GET /api/cart - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get fresh user data from database
    const user = await getUserById(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get fresh user data from database
    const user = await getUserById(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is active
    if (product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 });
    }

    // Check stock if stock management is enabled
    if (product.manageStock && product.stockQuantity !== null) {
      if (product.stockQuantity < validatedData.quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Update quantity if item already exists
      const newQuantity = existingCartItem.quantity + validatedData.quantity;
      
      // Check stock again for the new total quantity
      if (product.manageStock && product.stockQuantity !== null) {
        if (product.stockQuantity < newQuantity) {
          return NextResponse.json(
            { error: 'Insufficient stock for requested quantity' },
            { status: 400 }
          );
        }
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
        },
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
        },
      });
    }

    await prisma.$disconnect();
    return NextResponse.json(
      { 
        message: 'Item added to cart successfully',
        cartItem 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
   const authUser = getAuthUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get fresh user data from database
    const user = await getUserById(authUser.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all cart items for the user
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}