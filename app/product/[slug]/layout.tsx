import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
    regularPrice: number | null
    salePrice?: number | null
    sku?: string
    status: string
    stockStatus: string
    images?: {
        id: string
        url: string
        alt?: string
        isMain: boolean
    }[]
    category?: {
        name: string
    }
    reviews?: {
        rating: number
    }[]
}

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/slug/${slug}`, {
            cache: 'no-store'
        })
        
        if (!response.ok) {
            return null
        }
        
        return await response.json()
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const product = await getProduct(params.slug)
    
    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        }
    }
    
    const formatPrice = (price: number | null) => `Rs ${price || 0}`
    const currentPrice = product.salePrice || product.regularPrice || 0
    const hasDiscount = product.salePrice && product.regularPrice && product.salePrice < product.regularPrice
    const discountPercent = hasDiscount && product.regularPrice
        ? Math.round(((product.regularPrice - currentPrice) / product.regularPrice) * 100)
        : 0
    
    const mainImage = product.images && product.images.length > 0 
        ? (product.images.find(img => img.isMain) || product.images[0])
        : null
    
    const averageRating = product.reviews && product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0
    
    const title = `${product.name} - ${formatPrice(currentPrice)}${hasDiscount ? ` (${discountPercent}% Off)` : ''}`
    const description = product.shortDescription || product.description || `Buy ${product.name} at the best price. ${product.category?.name ? `Shop ${product.category.name} products` : 'Shop now'} with fast delivery and great customer service.`
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const productUrl = `${baseUrl}/product/${product.slug}`
    
    return {
        title,
        description,
        keywords: [
            product.name,
            product.category?.name || '',
            'ecommerce',
            'online shopping',
            'buy online',
            product.sku || ''
        ].filter(Boolean).join(', '),
        authors: [{ name: 'Your Store Name' }],
        creator: 'Your Store Name',
        publisher: 'Your Store Name',
        robots: {
            index: product.status === 'ACTIVE',
            follow: true,
            googleBot: {
                index: product.status === 'ACTIVE',
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: productUrl,
            title,
            description,
            siteName: 'Your Store Name',
            images: mainImage ? [
                {
                    url: mainImage.url,
                    width: 800,
                    height: 800,
                    alt: mainImage.alt || product.name,
                    type: 'image/jpeg',
                }
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@yourstorename',
            images: mainImage ? [mainImage.url] : [],
        },
        alternates: {
            canonical: productUrl,
        },
        other: {
            'product:price:amount': (currentPrice || 0).toString(),
            'product:price:currency': 'PKR',
            'product:availability': product.stockStatus === 'IN_STOCK' ? 'in stock' : 'out of stock',
            'product:condition': 'new',
            'product:retailer_item_id': product.sku || product.id,
        },
    }
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}