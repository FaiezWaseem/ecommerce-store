"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

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

interface CheckoutForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    notes: string;
}

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<CheckoutForm>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan',
        notes: ''
    });

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
            setForm(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
            }))
        }
    }, [user]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cartItems || []);
                if (data.cartItems?.length === 0) {
                    router.push('/cart');
                }
            } else {
                toast.error('Failed to load cart items');
                router.push('/cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart items');
            router.push('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        for (const field of required) {
            if (!form[field as keyof CheckoutForm]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                return false;
            }
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        
        // Validate phone
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(form.phone)) {
            toast.error('Please enter a valid phone number');
            return false;
        }
        
        if (form.alternatePhone && !phoneRegex.test(form.alternatePhone)) {
            toast.error('Please enter a valid alternate phone number');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setSubmitting(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shippingAddress: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        phone: form.phone,
                        alternatePhone: form.alternatePhone,
                        address: form.address,
                        city: form.city,
                        state: form.state,
                        zipCode: form.zipCode,
                        country: form.country
                    },
                    notes: form.notes,
                    cartItems
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Order placed successfully!');
                router.push(`/order-confirmation?orderId=${data.orderId}`);
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.product.salePrice || item.product.regularPrice) * item.quantity), 0);
    const shipping = 300; // Fixed shipping cost
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
            <Header />
            
            {/* Breadcrumb */}
            <div className="container py-4">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link href="/cart" className="hover:text-foreground">Cart</Link>
                    <span>/</span>
                    <span className="text-foreground">Checkout</span>
                </nav>
            </div>

            <div className="container py-6">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Checkout Form */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleInputChange}
                                            placeholder="+92 300 1234567"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
                                        <Input
                                            id="alternatePhone"
                                            name="alternatePhone"
                                            type="tel"
                                            value={form.alternatePhone}
                                            onChange={handleInputChange}
                                            placeholder="+92 300 1234567"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="address">Street Address *</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        value={form.address}
                                        onChange={handleInputChange}
                                        placeholder="House/Flat number, Street name, Area"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={form.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State/Province *</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={form.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            value={form.zipCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country *</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={form.country}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleInputChange}
                                        placeholder="Special instructions for delivery"
                                    />
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                                            <Image
                                                src={item.product.images[0]?.url || "/placeholder.svg"}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm">{item.product.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity} × Rs {item.product.salePrice || item.product.regularPrice}
                                            </p>
                                        </div>
                                        <div className="font-medium">
                                            Rs {(Number(item.product.salePrice || item.product.regularPrice) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <Separator className="my-4" />
                            
                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>Rs {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping:</span>
                                    <span>Rs {shipping.toFixed(2)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>Rs {total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleSubmit}
                                className="w-full mt-6" 
                                size="lg"
                                disabled={submitting}
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}