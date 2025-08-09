import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { requireRole } from '@/lib/middleware';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
    try {
        await prisma.$connect();
        requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);
        // Get query parameters for pagination and filtering
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        // Build where clause
        const where: any = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } }
            ];
        }

        // Get orders with pagination
        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where,
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
                                    images: {
                                        take: 1
                                    }
                                }
                            }
                        }
                    },
                    shippingAddress: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.order.count({ where })
        ]);

        await prisma.$disconnect();
        return NextResponse.json({
            orders,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await prisma.$connect();
        // Verify authentication and admin role
        requireRole(request, ['SUPER_ADMIN', 'MANAGEMENT']);

        const { orderId, status, trackingNumber } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                ...(status && { status }),
                ...(trackingNumber && { trackingNumber })
            },
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
                                images: {
                                    take: 1
                                }
                            }
                        }
                    }
                },
                shippingAddress: true
            }
        });

        await prisma.$disconnect();
        return NextResponse.json({ order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}