"use server";
import Footer from "@/components/footer"
import Header from "@/components/header"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductClientComponent from './ProductClientComponent'

import { toast } from 'sonner'
import Link from 'next/link'

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/slug/${slug}`, {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?category=${categoryId}&limit=4&status=ACTIVE`, {
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



export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProduct(params.slug)

    if (!product) {
        notFound()
    }

    const relatedProducts = product.category ? await getRelatedProducts(product.category.id, product.id) : []







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

    
    const regularPriceNum = typeof product.regularPrice === 'string' ? parseFloat(product.regularPrice) : product.regularPrice
    const salePriceNum = product.salePrice ? (typeof product.salePrice === 'string' ? parseFloat(product.salePrice) : product.salePrice) : null
    
    const currentPrice = salePriceNum || regularPriceNum || 0
    const hasDiscount = salePriceNum && regularPriceNum && salePriceNum > 0 && salePriceNum < regularPriceNum
    const discountPercent = hasDiscount && regularPriceNum
        ? Math.round(((regularPriceNum - currentPrice) / regularPriceNum) * 100)
        : 0

    // Generate structured data for SEO
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
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

                <main className="container py-6" itemScope itemType="https://schema.org/Product">
                    <meta itemProp="name" content={product.name} />
                    <meta itemProp="sku" content={product.sku || product.id} />
                    <meta itemProp="category" content={product.category?.name || 'General'} />
                    <meta itemProp="url" content={productUrl} />
                    {mainImage && <meta itemProp="image" content={mainImage.url} />}
                    <ProductClientComponent
                        product={product}
                        relatedProducts={relatedProducts}
                        averageRating={averageRating}
                        mainImage={mainImage}
                        galleryImages={galleryImages}
                        currentPrice={currentPrice}
                        hasDiscount={true}
                        regularPriceNum={regularPriceNum}
                        discountPercent={discountPercent}
                        productUrl={productUrl}
                    />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
          
}