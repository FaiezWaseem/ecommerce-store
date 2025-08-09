'use client'

import { useState, useEffect } from 'react'
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
import { Heart, Minus, Plus, Star, Truck, ShoppingCart } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { toast } from 'sonner'

interface ProductPageProps {
    params: {
        slug: string
    }
}

interface Product {
    id: string
    name: string
    slug: string
    description?: string
    shortDescription?: string
    sku?: string
    regularPrice: string | number
    salePrice?: string | number | null
    status: string
    stockStatus: string
    featuredVideoLink: string
    stockQuantity?: number
    isFeatured: boolean
    manageStock: boolean
    enableReviews: boolean
    category?: {
        id: string
        name: string
        slug: string
    }
    images?: {
        id: string
        url: string
        alt?: string
        isMain: boolean
        sortOrder: number
    }[]
    reviews?: {
        id: string
        rating: number
        comment?: string
        user: {
            firstName?: string
            lastName?: string
        }
    }[]
    _count?: {
        reviews: number
    }
}

async function getProduct(slug: string): Promise<Product | null> {
    try {
        console.log('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL)
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/slug/${slug}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.success ? data.data : null
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?category=${categoryId}&limit=4&status=ACTIVE`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        const products = data.success ? data.data : []

        // Filter out the current product and return up to 4 related products
        return products.filter((product: Product) => product.id !== currentProductId).slice(0, 4)
    } catch (error) {
        console.error('Error fetching related products:', error)
        return []
    }
}

// SEO metadata is now handled by layout.tsx

export default function ProductPage({ params }: ProductPageProps) {
    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [selectedColor, setSelectedColor] = useState('white')
    const [selectedSize, setSelectedSize] = useState('m')

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await getProduct(params.slug)
                if (!productData) {
                    setIsLoading(false)
                    return
                }
                setProduct(productData)

                // Fetch related products if category exists
                if (productData.category) {
                    const related = await getRelatedProducts(productData.category.id, productData.id)
                    setRelatedProducts(related)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
                toast.error('Failed to load product')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProductData()
    }, [params.slug])

    const addToCart = async () => {
        if (!product) return

        setIsAddingToCart(true)
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Please login to add items to cart')
                    // Optionally redirect to login page
                    // router.push('/login')
                    return
                }
                throw new Error(data.error || 'Failed to add to cart')
            }

            toast.success('Product added to cart successfully!')
            // Optionally reset quantity or update cart count in header
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
        } finally {
            setIsAddingToCart(false)
        }
    }

    const increaseQuantity = () => {
        if (product?.manageStock && product.stockQuantity !== null) {
            //@ts-ignore
            if (quantity < product.stockQuantity) {
                setQuantity(prev => prev + 1)
            } else {
                toast.error('Cannot exceed available stock')
            }
        } else {
            setQuantity(prev => prev + 1)
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    if (isLoading) {
        return (
            <div className="lg:container lg:py-4">
                <Header />
                <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading product...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return <div className="lg:container lg:py-4">
            <Header />
            <div className="min-h-[50vh]">
                Product Not found
            </div>
            <Footer />
        </div>
    }

    // Related products are now fetched in useEffect

    // Calculate average rating
    const averageRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

    // Get main image and gallery images
    const mainImage = product.images && product.images.length > 0
        ? (product.images.find(img => img.isMain) || product.images[0])
        : null
    const galleryImages = product.images && product.images.length > 0 ? product.images : []

    // Format price
    const formatPrice = (price: string | number | null | undefined) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : (price || 0)
        return `Rs ${numPrice}`
    }
    
    const regularPriceNum = typeof product.regularPrice === 'string' ? parseFloat(product.regularPrice) : product.regularPrice
    const salePriceNum = product.salePrice ? (typeof product.salePrice === 'string' ? parseFloat(product.salePrice) : product.salePrice) : null
    
    const currentPrice = salePriceNum || regularPriceNum || 0
    const hasDiscount = salePriceNum && regularPriceNum && salePriceNum > 0 && salePriceNum < regularPriceNum
    const discountPercent = hasDiscount && regularPriceNum
        ? Math.round(((regularPriceNum - currentPrice) / regularPriceNum) * 100)
        : 0

    // Generate structured data for SEO
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
    const productUrl = `${baseUrl}/product/${product.slug}`

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.shortDescription || product.description || `High quality ${product.name}`,
        "sku": product.sku || product.id,
        "url": productUrl,
        "image": mainImage ? [mainImage.url] : [],
        "brand": {
            "@type": "Brand",
            "name": "Your Store Name"
        },
        "category": product.category?.name || "General",
        "offers": {
            "@type": "Offer",
            "price": currentPrice,
            "priceCurrency": "PKR",
            "availability": product.stockStatus === 'IN_STOCK'
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            "condition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "Your Store Name"
            },
            "url": productUrl,
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        },
        "aggregateRating": averageRating > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": averageRating.toFixed(1),
            "reviewCount": product._count?.reviews || 0,
            "bestRating": 5,
            "worstRating": 1
        } : undefined,
        "review": product.reviews && product.reviews.length > 0 ? product.reviews.slice(0, 5).map(review => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": 5,
                "worstRating": 1
            },
            "author": {
                "@type": "Person",
                "name": `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || "Anonymous"
            },
            "reviewBody": review.comment || ""
        })) : undefined
    }

    // Breadcrumb structured data
    const breadcrumbStructuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            ...(product.category ? [{
                "@type": "ListItem",
                "position": 2,
                "name": product.category.name,
                "item": `${baseUrl}/category/${product.category.slug}`
            }] : []),
            {
                "@type": "ListItem",
                "position": product.category ? 3 : 2,
                "name": product.name,
                "item": productUrl
            }
        ]
    }

    return (
        <>
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbStructuredData)
                }}
            />

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
                        {product.category && (
                            <>
                                <Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
                                    {product.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-foreground">{product.name}</span>
                    </nav>
                </div>

                {/* Product Details with mobile grid layout */}
                <main className="container py-6" itemScope itemType="https://schema.org/Product">
                    <meta itemProp="name" content={product.name} />
                    <meta itemProp="sku" content={product.sku || product.id} />
                    <meta itemProp="category" content={product.category?.name || 'General'} />
                    <meta itemProp="url" content={productUrl} />
                    {mainImage && <meta itemProp="image" content={mainImage.url} />}

                    {/* Main layout: block by default, grid on md+ */}
                    <div className="block md:grid md:grid-cols-2 gap-8">
                        {/* Product Gallery */}
                        <div className="space-y-4">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {
                                        product.featuredVideoLink && (
                                            <CarouselItem >
                                                <div className="relative aspect-square flex justify-center items-center bg-black overflow-hidden rounded-lg border">
                                                    <video
                                                        src={product.featuredVideoLink}
                                                        controls
                                                        autoPlay
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        )
                                    }
                                    {galleryImages.length > 0 ? galleryImages.map((image) => (
                                        <CarouselItem key={image.id}>
                                            <div className="relative aspect-square overflow-hidden rounded-lg border">
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt || product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    )) : (
                                        <CarouselItem>
                                            <div className="relative aspect-square overflow-hidden rounded-lg border">
                                                <Image
                                                    src="/placeholder.svg"
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    )}
                                </CarouselContent>
                                {(galleryImages.length > 1 || product.featuredVideoLink) && (
                                    <>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </>
                                )}
                            </Carousel>
                            {galleryImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {galleryImages.slice(0, 4).map((image) => (
                                        <button
                                            key={image.id}
                                            className="relative aspect-square overflow-hidden rounded-lg border hover:border-primary"
                                        >
                                            <Image
                                                src={image.url}
                                                alt={image.alt || product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <header>
                                <h1 className="text-2xl font-bold">{product.name}</h1>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex" role="img" aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= Math.round(averageRating)
                                                        ? "fill-primary text-primary"
                                                        : "text-muted-foreground"
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        ({product._count?.reviews || 0} Reviews)
                                    </span>
                                    <span className={`text-sm ${product.stockStatus === 'IN_STOCK' ? 'text-green-500' :
                                            product.stockStatus === 'OUT_OF_STOCK' ? 'text-red-500' :
                                                'text-yellow-500'
                                        }`} aria-label={`Stock status: ${product.stockStatus === 'IN_STOCK' ? 'In Stock' : product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'On Backorder'}`}>
                                        {product.stockStatus === 'IN_STOCK' ? 'In Stock' :
                                            product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' :
                                                'On Backorder'}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-2xl font-bold" itemProp="price" content={currentPrice.toString()}>{formatPrice(currentPrice)}</span>
                                    {hasDiscount && (
                                        <span className="text-lg text-muted-foreground line-through" itemProp="highPrice" content={regularPriceNum.toString()}>
                                            {formatPrice(regularPriceNum)}
                                        </span>
                                    )}
                                    {hasDiscount && (
                                        <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                                            -{discountPercent}%
                                        </span>
                                    )}
                                </div>
                            </header>

                            <Separator />

                            {/* Description */}
                            <section aria-labelledby="product-description">
                                <h2 id="product-description" className="sr-only">Product Description</h2>
                                <p className="text-sm leading-relaxed text-muted-foreground" itemProp="description">
                                    {product.shortDescription || product.description || 'No description available.'}
                                </p>
                            </section>

                            {/* Colors & Size - mobile stacking, side-by-side on larger screens */}
                            <div className="space-y-4">
                                {/* Colors */}
                                <div>
                                    <h3 className="mb-2 font-medium">Colours:</h3>
                                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-2">
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

                                {/* Size - stacked on mobile, side-by-side on lg+ */}
                                <div>
                                    <h3 className="mb-2 font-medium">Size:</h3>
                                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
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

                                {/* Quantity Controls */}
                                <div>
                                    <h3 className="mb-2 font-medium">Quantity:</h3>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="px-3 py-2 hover:bg-gray-100"
                                            aria-label="Decrease Quantity"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <div className="w-12 text-center border-x border-gray-300 py-2">{quantity}</div>
                                        <button
                                            onClick={increaseQuantity}
                                            className="px-3 py-2 hover:bg-gray-100"
                                            aria-label="Increase Quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {product.stockQuantity !== null && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {product.stockQuantity} items available
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Desktop Action Buttons */}
                            <div className="hidden md:flex gap-4">
                                <Button
                                    onClick={addToCart}
                                    disabled={product.stockStatus === 'OUT_OF_STOCK' || isAddingToCart}
                                    className="px-8 py-3 font-semibold flex items-center gap-2"
                                    variant="outline"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-4 w-4" />
                                            
                                            {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
                                        </>
                                    )}
                                </Button>
                             
                            </div>
                        </div>
                    </div>
                </main>


                {/* Sticky Buy Button - Mobile Only */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white p-4 shadow-lg mb-[50px]">
                    <div className="flex items-center gap-2 max-w-7xl mx-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                                onClick={decreaseQuantity}
                                className="px-2 py-1 hover:bg-gray-100"
                                aria-label="Decrease Quantity"
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-10 text-center border-x border-gray-300">{quantity}</div>
                            <button
                                onClick={increaseQuantity}
                                className="px-2 py-1 hover:bg-gray-100"
                                aria-label="Increase Quantity"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={addToCart}
                            disabled={product.stockStatus === 'OUT_OF_STOCK' || isAddingToCart}
                            className={`flex-1 px-3 py-3 rounded-md font-semibold flex items-center gap-1 ${product.stockStatus === 'OUT_OF_STOCK' || isAddingToCart
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                                }`}
                        >
                            {isAddingToCart ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                                <div className='flex flex-1 justify-evenly items-center'>
                                <ShoppingCart className="h-4 w-4" />
                                {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add To Cart'}
                                </div>
                            )}
                        </button>

                        {/* Buy Button */}
                        {/* <button
                            className={`flex-1 px-4 py-3 rounded-md font-semibold ${product.stockStatus === 'OUT_OF_STOCK'
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-primary text-white'
                                }`}
                            disabled={product.stockStatus === 'OUT_OF_STOCK'}
                        >
                            {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Buy Now'}
                        </button> */}

                        {/* Wishlist */}
                        <button className="p-2 border border-gray-300 rounded-full bg-white">
                            <Heart className="h-4 w-4 text-primary" />
                        </button>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="container py-12 mb-[100px]" aria-labelledby="related-products">
                        <h2 id="related-products" className="mb-6 text-2xl font-bold">Related Items</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => {
                                const relatedRegularPriceNum = typeof relatedProduct.regularPrice === 'string' ? parseFloat(relatedProduct.regularPrice) : relatedProduct.regularPrice
                                const relatedSalePriceNum = relatedProduct.salePrice ? (typeof relatedProduct.salePrice === 'string' ? parseFloat(relatedProduct.salePrice) : relatedProduct.salePrice) : null
                                
                                const relatedCurrentPrice = relatedSalePriceNum || relatedRegularPriceNum
                                const relatedHasDiscount = relatedSalePriceNum && relatedRegularPriceNum && relatedSalePriceNum < relatedRegularPriceNum
                                const relatedDiscountPercent = relatedHasDiscount && relatedRegularPriceNum
                                    ? Math.round(((relatedRegularPriceNum - relatedCurrentPrice) / relatedRegularPriceNum) * 100)
                                    : 0
                                const relatedAverageRating = relatedProduct.reviews && relatedProduct.reviews.length > 0
                                    ? relatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / relatedProduct.reviews.length
                                    : 0
                                const relatedMainImage = relatedProduct.images && relatedProduct.images.length > 0
                                    ? (relatedProduct.images.find(img => img.isMain) || relatedProduct.images[0])
                                    : null

                                return (
                                    <Link key={relatedProduct.id} href={`/product/${relatedProduct.slug}`}>
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="relative aspect-square">
                                                {relatedHasDiscount && (
                                                    <div className="absolute left-2 top-2 z-10 rounded bg-red-500 px-2 py-1 text-xs text-white">
                                                        -{relatedDiscountPercent}%
                                                    </div>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-2 z-10 rounded-full bg-white"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                                <Image
                                                    src={relatedMainImage?.url || "/placeholder.svg"}
                                                    alt={relatedMainImage?.alt || relatedProduct.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold line-clamp-2">{relatedProduct.name}</h3>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="font-medium text-primary">
                                                        {formatPrice(relatedCurrentPrice)}
                                                    </span>
                                                    {relatedHasDiscount && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {formatPrice(relatedRegularPriceNum)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex items-center gap-1">
                                                    {Array(5)
                                                        .fill(null)
                                                        .map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < Math.round(relatedAverageRating)
                                                                        ? "fill-primary text-primary"
                                                                        : "text-muted-foreground"
                                                                    }`}
                                                            />
                                                        ))}
                                                    <span className="text-sm text-muted-foreground">
                                                        ({relatedProduct._count?.reviews || 0})
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
}