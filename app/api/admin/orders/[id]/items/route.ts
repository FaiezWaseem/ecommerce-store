import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireRole } from '@/lib/middleware';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$connect();
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const orderId = params.id;
    const { productId, quantity, customPrice } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid product or quantity' }, { status: 400 });
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Use custom price if provided, otherwise use product price
    const itemPrice = customPrice && customPrice > 0 ? customPrice : (product.salePrice || product.regularPrice);

    // Check if product already exists in order
    const existingItem = await prisma.orderItem.findFirst({
      where: {
        orderId: orderId,
        productId: productId,
      },
    });

    if (existingItem) {
      // Update existing item quantity
      await prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: itemPrice, // Update price in case of custom pricing
        },
      });
    } else {
      // Create new order item
      await prisma.orderItem.create({
        data: {
          orderId: orderId,
          productId: productId,
          quantity: quantity,
          price: itemPrice,
          total: itemPrice * quantity,
        },
      });
    }

    // Recalculate order total
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: orderId },
    });

    const newTotal = orderItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    // Update order total
    await prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: Number(newTotal ?? 0) },
    });

    // Fetch updated order with all details
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json({ 
      message: 'Product added to order successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error adding product to order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}