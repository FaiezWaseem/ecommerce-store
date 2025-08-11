import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { requireRole } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
    const orderId = params.id;

    // Get order with all related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        shippingAddress: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching admin order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
     requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

    const orderId = params.id;
    const { status, trackingNumber, customerDetails, shippingAddress } = await request.json();

    // Get existing order first
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: any = {
      status: status || order.status,
      trackingNumber: trackingNumber || order.orderNumber,
    };

    // Update customer details if provided
    if (customerDetails) {
      await prisma.user.update({
        where: { id: order.userId },
        data: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
        },
      });
    }

    // Update shipping address if provided
    if (shippingAddress) {
      //@ts-ignore
      await prisma.shippingAddress.update({
        where: { id: order.shippingAddressId },
        data: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          alternatePhone: shippingAddress.alternatePhone,
        },
      });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        shippingAddress: true
      }
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating admin order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}