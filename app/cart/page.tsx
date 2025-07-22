"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Minus, Plus, X } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        regularPrice: string;
        salePrice: string;
        images: Array<{
            id: string;
            url: string;
            isMain: boolean;
        }>;
    };
}

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch cart items
    useEffect(() => {
        if (user) {
            fetchCartItems();
        }
    }, [user]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cartItems || []);
            } else {
                toast.error('Failed to load cart items');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdating(itemId);
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                setCartItems(prev =>
                    prev.map(item =>
                        item.id === itemId
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
                toast.success('Cart updated');
            } else {
                toast.error('Failed to update cart');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Failed to update cart');
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (itemId: string) => {
        setUpdating(itemId);
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCartItems(prev => prev.filter(item => item.id !== itemId));
                toast.success('Item removed from cart');
            } else {
                toast.error('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        } finally {
            setUpdating(null);
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
            });

            if (response.ok) {
                setCartItems([]);
                toast.success('Cart cleared');
            } else {
                toast.error('Failed to clear cart');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.product.salePrice || item.product.regularPrice) * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container py-8">
                    <div className="text-center">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }


    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header />
            {/* Breadcrumb */}
            <div className="container py-4">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">Cart</span>
                </nav>
            </div>

            {/* Mobile Cart - native app feel */}
            <div className="block md:hidden px-2 py-4 pb-32 space-y-4">
                {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Your cart is empty</p>
                        <Button asChild>
                            <Link href="/">Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 mb-[25vh]">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow flex gap-3 p-3 ">
                                <div className="relative h-24 w-24 rounded-lg bg-gray-100 overflow-hidden border flex-shrink-0">
                                    <Image
                                        src={item.product.images[0]?.url || "/placeholder.svg"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col flex-grow justify-between">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-base">{item.product.name}</h3>
                                            <div className="text-sm text-gray-500">Rs { item.product.salePrice || item.product.regularPrice}</div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => removeItem(item.id)}
                                            disabled={updating === item.id}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-r-none"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={updating === item.id || item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-l-none"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={updating === item.id}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="font-bold text-lg">Rs {Number( item.product.salePrice || item.product.regularPrice) * item.quantity}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Mobile cart summary as sticky card */}
            {cartItems.length > 0 && (
                <div className="block md:hidden fixed bottom-16 left-0 right-0 z-40 px-2">
                    <Card className="p-4 rounded-xl shadow-lg">
                        <h2 className="text-base font-semibold text-center mb-2">Cart Total</h2>
                        {/* Coupon */}
                        <div className="flex gap-2 mb-2">
                            <Input placeholder="Coupon Code" className="flex-grow" />
                            <Button>Apply Coupon</Button>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="font-bold">Rs {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Shipping:</span>
                            <span className="font-bold text-xs text-muted-foreground">Approx (250 ~ 500)</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600 font-medium">Total:</span>
                            <span className="text-lg font-bold">Rs {total.toFixed(2)}</span>
                        </div>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={() => router.push('/checkout')}
                        >
                            Process to checkout
                        </Button>
                    </Card>
                </div>
            )}
            {/* Desktop Cart */}
            <div className="hidden md:block container py-6">
                <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8">
                    {/* Cart Items */}
                    <div className="space-y-8">
                        <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-6">
                            <div className="text-sm font-medium">Product</div>
                            <div className="text-sm font-medium">Price</div>
                            <div className="text-sm font-medium">Quantity</div>
                            <div className="text-sm font-medium">Subtotal</div>
                        </div>

                        <Separator className="hidden md:block" />

                        {/* Cart Items */}
                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                                <Button asChild>
                                    <Link href="/">Start Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {cartItems.map((item) => (
                                    <div key={item.id}>
                                        {/* Mobile Layout */}
                                        <div className="grid grid-cols-[80px_1fr] gap-4 md:hidden">
                                            <div className="relative aspect-square overflow-hidden rounded-lg border">
                                                <Image
                                                    src={item.product.images[0]?.url || "/placeholder.svg"}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium">{item.product.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Rs {Number(item.product)}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={updating === item.id}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove item</span>
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-r-none"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={updating === item.id || item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                            <span className="sr-only">Decrease quantity</span>
                                                        </Button>
                                                        <div className="flex h-8 w-12 items-center justify-center border-y">
                                                            {item.quantity}
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-l-none"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={updating === item.id}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                            <span className="sr-only">Increase quantity</span>
                                                        </Button>
                                                    </div>
                                                    <p className="font-medium">
                                                        Rs{((Number(item.product.regularPrice) - Number(item.product.salePrice)) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Layout */}
                                        <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-6">
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={updating === item.id}
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">Remove item</span>
                                                </Button>
                                                <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                                                    <Image
                                                        src={item.product.images[0]?.url || "/placeholder.svg"}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <h3 className="font-medium">{item.product.name}</h3>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                {
                                                    item.product.salePrice ? (
                                                        <span>Rs {Number(item.product.salePrice)}</span>
                                                    ) : (
                                                        <span>Rs {item.product.regularPrice}</span>
                                                    )
                                                }
                                                {(item.product.regularPrice && item.product.salePrice && item.product.regularPrice !== item.product.salePrice) && (
                                                    <span className="text-xs ml-1 text-muted-foreground line-through">Rs{item.product.regularPrice}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-r-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={updating === item.id || item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                        <span className="sr-only">Decrease quantity</span>
                                                    </Button>
                                                    <div className="flex h-8 w-12 items-center justify-center border-y">
                                                        {item.quantity}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-l-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={updating === item.id}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                        <span className="sr-only">Increase quantity</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center font-medium">
                                                {
                                                    item.product.salePrice ? (
                                                        <span>Rs {Number(item.product.salePrice) * item.quantity}</span>
                                                    ) : (
                                                        <span>Rs {Number(item.product.regularPrice) * item.quantity}</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="sm:w-auto"
                                >
                                    <Link href="/">Return To Shop</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="sm:w-auto"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        )}
                    </div>


                    {/* Cart Summary Desktop */}
                    {cartItems.length > 0 && (
                        <div className="hidden md:block mt-8 lg:mt-0">
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold">Cart Total</h2>
                                <div className="mt-4 space-y-4">
                                    {/* Coupon */}
                                    <div className="flex gap-2">
                                        <Input placeholder="Coupon Code" />
                                        <Button>Apply Coupon</Button>
                                    </div>
                                    <Separator />
                                    {/* Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping:</span>
                                            <span className="font-medium text-xs text-muted-foreground">Approx (250 ~ 500)</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total:</span>
                                            <span className="font-medium">Rs {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={() => router.push('/checkout')}
                                    >
                                        Process to checkout
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

