import { Metadata } from 'next'
import { Suspense } from 'react'

interface SearchLayoutProps {
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: { params: {} }
): Promise<Metadata> {
  // Since we can't use searchParams in layout, we'll use a default approach
  const searchQuery = ''
  const category = ''
  
  // Base metadata
  const baseTitle = 'Search Products ~ Samreens'
  const baseDescription = 'Search and discover amazing products with advanced filters at Samreens. Find exactly what you\'re looking for with our comprehensive product search.'
  
  // Dynamic title and description based on search parameters
  let title = baseTitle
  let description = baseDescription
  
  if (searchQuery) {
    title = `Search Results for "${searchQuery}" | Samreens`
    description = `Find products matching "${searchQuery}" at Samreens. Browse through our extensive collection with advanced filtering options.`
  } else if (category) {
    title = `${category} Products | Search & Filter | Samreens`
    description = `Explore ${category} products with advanced search and filtering options at Samreens. Find the perfect product for your needs.`
  } else {
    title = `Product Search | Find Your Perfect Product | Samreens`
    description = `Search and discover amazing products with advanced filters at Samreens. Find exactly what you're looking for with our comprehensive product search.`
  }
  
  const keywords = [
    'product search',
    'online shopping',
    'filter products',
    'samreens',
    'samreen bedding collection',
    'find products',
    'e-commerce search',
    searchQuery,
    category
  ].filter(Boolean).join(', ')
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Samreens',
      images: [
        {
          url: '/assets/images/search-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Product Search : Samreens'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/images/search-og.jpg']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: searchQuery 
        ? `/search?q=${encodeURIComponent(searchQuery)}`
        : '/search'
    }
  }
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
}