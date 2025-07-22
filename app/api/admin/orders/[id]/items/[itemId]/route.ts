import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireRole } from '@/lib/middleware';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, itemId: string } }
) {
  try {
    // Check if user has admin permissions
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const orderId = params.id;
    const itemId = params.itemId;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order item exists and belongs to the order
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: itemId,
        orderId: orderId,
      },
    });

    if (!orderItem) {
      return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
    }

    // Delete order item
    await prisma.orderItem.delete({
      where: { id: itemId },
    });

    // Recalculate order total
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: orderId },
    });

    //@ts-ignore
    const newTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

    return NextResponse.json({ 
      message: 'Order item removed successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error removing order item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}