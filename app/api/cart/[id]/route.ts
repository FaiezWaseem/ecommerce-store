import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getUserById, verifyToken } from '@/lib/auth';
import { z } from 'zod';
import { getAuthUser } from '@/lib/middleware';

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateCartItemSchema.parse(body);

    // Check if cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Check stock if stock management is enabled
    if (cartItem.product.manageStock && cartItem.product.stockQuantity !== null) {
      if (cartItem.product.stockQuantity < validatedData.quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }
    }

    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity: validatedData.quantity },
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

    return NextResponse.json({
      message: 'Cart item updated successfully',
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
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

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if cart item exists and belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}