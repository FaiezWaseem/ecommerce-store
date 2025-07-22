import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import {  getUserById } from '@/lib/auth';
import { getAuthUser } from '@/lib/middleware';

const prisma = new PrismaClient();

export async function GET(
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


        const order = await prisma.order.findFirst({
            where: {
                id: params.id,
                userId: user.id // Ensure user can only access their own orders
            },
            include: {
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
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ order });

    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}