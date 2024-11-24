import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp, Minus, Plus, X } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
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

            <div className="container py-6">
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
                        <div className="space-y-8">
                            {[
                                {
                                    id: 1,
                                    name: "LCD Monitor",
                                    price: 650,
                                    quantity: 1,
                                    image: "/placeholder.svg",
                                },
                                {
                                    id: 2,
                                    name: "H1 Gamepad",
                                    price: 550,
                                    quantity: 2,
                                    image: "/placeholder.svg",
                                },
                            ].map((item) => (
                                <div key={item.id}>
                                    {/* Mobile Layout */}
                                    <div className="grid grid-cols-[80px_1fr] gap-4 md:hidden">
                                        <div className="relative aspect-square overflow-hidden rounded-lg border">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        ${item.price}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
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
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                        <span className="sr-only">Increase quantity</span>
                                                    </Button>
                                                </div>
                                                <p className="font-medium">
                                                    ${item.price * item.quantity}
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
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove item</span>
                                            </Button>
                                            <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <h3 className="font-medium">{item.name}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span>${item.price}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex items-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-r-none"
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
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    <span className="sr-only">Increase quantity</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center font-medium">
                                            ${item.price * item.quantity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <Button
                                variant="outline"
                                asChild
                                className="sm:w-auto"
                            >
                                <Link href="/">Return To Shop</Link>
                            </Button>
                            <Button variant="outline" className="sm:w-auto">
                                Update Cart
                            </Button>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="mt-8 lg:mt-0">
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
                                        <span className="font-medium">$1750</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping:</span>
                                        <span className="font-medium">Free</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="font-medium">$1750</span>
                                    </div>
                                </div>

                                <Button className="w-full" size="lg">
                                    Process to checkout
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

