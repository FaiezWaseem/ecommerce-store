'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Heart, Search, SlidersHorizontal, Star } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Product, Category, ProductSearchResponse } from "@/types/product"
import { toast } from "sonner"


export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State management
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  // Filters configuration

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories?isActive=true&limit=100')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  // Search products
  const searchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery) params.set('search', searchQuery)
      if (selectedCategories.length > 0) params.set('category', selectedCategories[0]) // For simplicity, use first selected category
      if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
      if (priceRange[1] < 1000) params.set('maxPrice', priceRange[1].toString())
      if (selectedRating) params.set('rating', selectedRating.toString())
      params.set('sort', sortBy)
      params.set('page', page.toString())
      params.set('limit', pagination.limit.toString())
      
      // Update URL query parameters - handled by handleSearch function now
      // We don't need to update URL here as it's handled by the handleSearch function

      const response = await fetch(`/api/search?${params.toString()}`)
      if (response.ok) {
        const data: ProductSearchResponse = await response.json()
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to search products')
      }
    } catch (error) {
      console.error('Error searching products:', error)
      toast.error('Failed to search products')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategories, priceRange, selectedRating, sortBy, pagination.limit])

  // Handle search input
  const handleSearch = () => {
    // Update URL with search query using Next.js router
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    
    // Use Next.js router to update URL
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
    
    searchProducts(1)
  }

  // Handle filter changes
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newSelectedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);
    
    setSelectedCategories(newSelectedCategories);
    
    // Update URL with category filter
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSelectedCategories.length > 0) {
      params.set('category', newSelectedCategories[0]); // For simplicity, use first selected category
    } else {
      params.delete('category');
    }
    
    // Use Next.js router to update URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    
    // Trigger search with updated filters
    searchProducts(1);
  }



  // Handle price range changes
  const handlePriceChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
    
    // Update URL with price range filter
    const params = new URLSearchParams(searchParams.toString());
    
    if (newPriceRange[0] > 0) {
      params.set('minPrice', newPriceRange[0].toString());
    } else {
      params.delete('minPrice');
    }
    
    if (newPriceRange[1] < 20000) {
      params.set('maxPrice', newPriceRange[1].toString());
    } else {
      params.delete('maxPrice');
    }
    
    // Use Next.js router to update URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    
    // Trigger search with updated filters
    searchProducts(1);
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    const newRating = checked ? rating : null;
    setSelectedRating(newRating);
    
    // Update URL with rating filter
    const params = new URLSearchParams(searchParams.toString());
    
    if (newRating) {
      params.set('rating', newRating.toString());
    } else {
      params.delete('rating');
    }
    
    // Use Next.js router to update URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    
    // Trigger search with updated filters
    searchProducts(1);
  }

  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    // Update URL with sort filter
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    
    // Use Next.js router to update URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    
    // Trigger search with updated filters
    searchProducts(1);
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
    searchProducts(page)
  }

  // Load initial data
  useEffect(() => {
    fetchCategories()
  }, [])

  // Search when filters change - using a ref to avoid dependency on searchProducts function
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip the initial render to avoid duplicate searches
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const timeoutId = setTimeout(() => {
      searchProducts(1)
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategories, priceRange, selectedRating, sortBy]) // Depend on the actual state values instead of searchProducts

  // Update filters from URL params - only run on initial load and when URL changes
  useEffect(() => {
    // Update search query
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    
    // Update category filter
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategories([category])
    } else {
      setSelectedCategories([])
    }
    
    // Update price range filter
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    
    // Only update price range if URL params exist and are different from current state
    if (minPrice || maxPrice) {
      const newPriceRange = [0, 20000] // Default values
      
      if (minPrice) {
        newPriceRange[0] = parseInt(minPrice)
      }
      
      if (maxPrice) {
        newPriceRange[1] = parseInt(maxPrice)
      }
      
      // Only update if values are different to avoid infinite loop
      if (newPriceRange[0] !== priceRange[0] || newPriceRange[1] !== priceRange[1]) {
        setPriceRange(newPriceRange)
      }
    }
    
    // Update rating filter
    const rating = searchParams.get('rating')
    if (rating) {
      setSelectedRating(parseInt(rating))
    } else {
      setSelectedRating(null)
    }
    
    // Update sort filter
    const sort = searchParams.get('sort')
    if (sort) {
      setSortBy(sort)
    }
  }, [searchParams]) // Remove priceRange from dependencies

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Search</span>
        </nav>
      </div>

      {/* Overlay and Drawer for mobile filters */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
            style={{
              transform: 'translateX(0)',
            }}
          >
            {/* Drawer Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            {/* Drawer Content */}
            <div className="p-4 overflow-y-auto h-full">
              {/* Same content as in Desktop Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="mb-4 text-lg font-semibold">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`mobile-category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                        />
                        <label
                          htmlFor={`mobile-category-${category.id}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Price Range */}
                <div>
                  <h4 className="mb-4 text-lg font-semibold">Price Range</h4>
                  <Slider
                    min={0}
                    max={20000}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="mb-4 text-lg font-semibold">Rating</h4>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center mb-2">
                      <Checkbox
                        id={`mobile-rating-${rating}`}
                        checked={selectedRating === rating}
                        onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                      />
                      <label
                        htmlFor={`mobile-rating-${rating}`}
                        className="ml-2 flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {Array(rating)
                          .fill(null)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        {Array(5 - rating)
                          .fill(null)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-muted-foreground" />
                          ))}
                        <span className="ml-1">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="md:container px-2 mb-[50px] py-6 relative z-10 flex flex-col lg:flex-row lg:gap-8">
        {/* Sidebar for large screens */}
        <aside className="hidden lg:block lg:w-1/4">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={`desktop-category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`desktop-category-${category.id}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Price Range */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
              <Slider
                min={0}
                max={20000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
                  className="w-20"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-20"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Rating</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <Checkbox
                    id={`desktop-rating-${rating}`}
                    checked={selectedRating === rating}
                    onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                  />
                  <label
                    htmlFor={`desktop-rating-${rating}`}
                    className="ml-2 flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {Array(rating)
                      .fill(null)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    {Array(5 - rating)
                      .fill(null)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-muted-foreground" />
                      ))}
                    <span className="ml-1">& Up</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Filters button for mobile */}
        <div className="flex lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsDrawerOpen(true)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search input and sort */}
            <div className="flex w-full items-center sm:w-auto">
              <Input
                placeholder="Search products..."
                className="rounded-r-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button className="rounded-l-none" onClick={handleSearch}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating-high-low">Rating: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <section aria-label="Search Results" role="main">
            {loading ? (
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-3" aria-label="Loading products">
                {Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-square bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-3 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-4 bg-muted animate-pulse rounded" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <Link href={`/product/${product.slug}`} key={product.name} >
                      <div className="relative aspect-square">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={`${product.name} - Product Image`}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-primary font-bold">Rs{product.salePrice || product.regularPrice}</span>
                          {(product.regularPrice && product.salePrice && product.regularPrice !== product.salePrice) && (
                            <span className="text-sm text-muted-foreground line-through">Rs{product.regularPrice}</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(0)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                                  }`}
                              />
                            ))}
                          <span className="text-sm text-muted-foreground">({'0.0'})</span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" role="status" aria-live="polite">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </section>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav aria-label="Search results pagination" className="mt-8 flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, pagination.page - 2) + i;
                if (pageNumber > pagination.totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          )}
        </main>
      </div >

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Your Store",
            "url": typeof window !== 'undefined' ? window.location.origin : '',
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": typeof window !== 'undefined' ? `${window.location.origin}/search?q={search_term_string}` : '/search?q={search_term_string}'
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Product List Structured Data */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": searchQuery ? `Search Results for "${searchQuery}"` : "Product Search Results",
              "description": searchQuery ? `Products matching "${searchQuery}"` : "Browse our product catalog",
              "numberOfItems": products.length,
              "itemListElement": products.map((product, index) => {
                const regularPriceNum = typeof product.regularPrice === 'string' ? parseFloat(product.regularPrice) : (product.regularPrice || 0)
                const salePriceNum = typeof product.salePrice === 'string' ? parseFloat(product.salePrice) : (product.salePrice || 0)
                const currentPrice = salePriceNum > 0 ? salePriceNum : regularPriceNum

                return {
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description || product.name,
                    "image": product.images && product.images.length > 0 ? product.images[0].url : '',
                    "url": typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `/product/${product.slug}`,
                    "sku": product.id,
                    "brand": {
                      "@type": "Brand",
                      "name": "Your Store"
                    },
                    "offers": {
                      "@type": "Offer",
                      "price": currentPrice.toFixed(2),
                      "priceCurrency": "PKR",
                      "availability": product.stockQuantity && product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                      "url": typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `/product/${product.slug}`
                    }
                  }
                }
              })
            })
          }}
        />
      )}

      {/* Footer */}
      < Footer />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": typeof window !== 'undefined' ? window.location.origin : ''
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": searchQuery ? `Search: ${searchQuery}` : "Search",
                "item": typeof window !== 'undefined' ? window.location.href : ''
              }
            ]
          })
        }}
      />
    </div>
  )
}