import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { getUserById } from '@/lib/auth';
import { getAuthUser } from '@/lib/middleware';

const prisma = new PrismaClient();

function generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
}

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
        const { shippingAddress, notes, cartItems } = body;

        // Validate required fields
        if (!shippingAddress || !cartItems || cartItems.length === 0) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }


        // Calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of cartItems) {
            const product = await prisma.product.findUnique({
                where: { id: item.product.id }
            });

            if (!product) {
                return NextResponse.json(
                    { message: `Product ${item.product.name} not found` },
                    { status: 404 }
                );
            }

            const price = Number(product.salePrice || product.regularPrice);
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: price,
                total: itemTotal
            });
        }

        const shippingAmount = 300; // Fixed shipping cost
        const totalAmount = subtotal + shippingAmount;

        // Create shipping address first
        const createdShippingAddress = await prisma.address.create({
            data: {
                userId: user.id,
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                address1: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone
            }
        });

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                orderNumber: generateOrderNumber(),
                status: 'PENDING',
                subtotal: subtotal,
                shippingAmount: shippingAmount,
                totalAmount: totalAmount,
                notes: notes || '',
                shippingAddressId: createdShippingAddress.id,
                items: {
                    create: orderItems
                }
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

        // Clear user's cart after successful order
        await prisma.cartItem.deleteMany({
            where: { userId: user.id }
        });

        return NextResponse.json({
            message: 'Order created successfully',
            orderId: order.id,
            order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

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


        const orders = await prisma.order.findMany({
            where: { userId: user.id },
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}