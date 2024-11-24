import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Heart, Minus, Plus, Star, Truck } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header />

            {/* Breadcrumb */}
            <div className="container py-4">
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href="/account" className="hover:text-foreground">
                        Account
                    </Link>
                    <span>/</span>
                    <Link href="/gaming" className="hover:text-foreground">
                        Gaming
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">Havic HV G-92 Gamepad</span>
                </nav>
            </div>

            {/* Product Details */}
            <div className="container py-6">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Product Gallery */}
                    <div className="space-y-4">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {[1, 2, 3, 4].map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative aspect-square overflow-hidden rounded-lg border">
                                            <Image
                                                src="/placeholder.svg"
                                                alt={`Product image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((_, index) => (
                                <button
                                    key={index}
                                    className="relative aspect-square overflow-hidden rounded-lg border hover:border-primary"
                                >
                                    <Image
                                        src="/placeholder.svg"
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold">Havic HV G-92 Gamepad</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <Star
                                            key={index}
                                            className="h-4 w-4 fill-primary text-primary"
                                        />
                                    ))}
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    (150 Reviews)
                                </span>
                                <span className="text-sm text-green-500">In Stock</span>
                            </div>
                            <div className="mt-4">
                                <span className="text-2xl font-bold">$192.00</span>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                PlayStation 5 Controller Skin High quality vinyl with air channel
                                adhesive for easy bubble free install & mess free removal Pressure
                                sensitive.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-2 font-medium">Colours:</h3>
                                <RadioGroup defaultValue="white" className="flex gap-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="white"
                                            id="white"
                                            className="border-2 border-gray-300"
                                        />
                                        <label htmlFor="white" className="text-sm">
                                            White
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="pink"
                                            id="pink"
                                            className="border-2 border-pink-300 bg-pink-500"
                                        />
                                        <label htmlFor="pink" className="text-sm">
                                            Pink
                                        </label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <h3 className="mb-2 font-medium">Size:</h3>
                                <RadioGroup defaultValue="m" className="flex flex-wrap gap-2">
                                    {["XS", "S", "M", "L", "XL"].map((size) => (
                                        <div
                                            key={size}
                                            className="flex h-10 w-10 items-center justify-center rounded-md border text-sm"
                                        >
                                            <RadioGroupItem
                                                value={size.toLowerCase()}
                                                id={size.toLowerCase()}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor={size.toLowerCase()}
                                                className="cursor-pointer p-2"
                                            >
                                                {size}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-r-none"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="flex h-10 w-14 items-center justify-center border-y">
                                        2
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-l-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button className="flex-1">Buy Now</Button>
                                <Button variant="outline" size="icon">
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Card className="p-4">
                                <div className="flex items-center gap-4">
                                    <Truck className="h-6 w-6" />
                                    <div>
                                        <h3 className="font-medium">Free Delivery</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Enter your postal code for Delivery Availability
                                        </p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-4">
                                    <Truck className="h-6 w-6" />
                                    <div>
                                        <h3 className="font-medium">Return Delivery</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Free 30 Days Delivery Returns. Details
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="container py-12">
                <h2 className="mb-6 text-2xl font-bold">Related Items</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            name: "HAVIT HV-G92 Gamepad",
                            price: "$120",
                            originalPrice: "$160",
                            discount: "-40%",
                            rating: 5,
                            reviews: 88,
                        },
                        {
                            name: "AK-900 Wired Keyboard",
                            price: "$960",
                            originalPrice: "$1160",
                            discount: "-35%",
                            rating: 4,
                            reviews: 75,
                        },
                        {
                            name: "IPS LCD Gaming Monitor",
                            price: "$370",
                            originalPrice: "$400",
                            discount: "-30%",
                            rating: 5,
                            reviews: 99,
                        },
                        {
                            name: "RGB liquid CPU Cooler",
                            price: "$160",
                            originalPrice: "$170",
                            discount: "-5%",
                            rating: 4,
                            reviews: 65,
                        },
                    ].map((product, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="relative aspect-square">
                                <div className="absolute left-2 top-2 z-10 rounded bg-red-500 px-2 py-1 text-xs text-white">
                                    {product.discount}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 z-10 rounded-full bg-white"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Image
                                    src="/placeholder.svg"
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold">{product.name}</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="font-medium text-primary">
                                        {product.price}
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                        {product.originalPrice}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-1">
                                    {Array(5)
                                        .fill(null)
                                        .map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < product.rating
                                                        ? "fill-primary text-primary"
                                                        : "text-muted-foreground"
                                                    }`}
                                            />
                                        ))}
                                    <span className="text-sm text-muted-foreground">
                                        ({product.reviews})
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

