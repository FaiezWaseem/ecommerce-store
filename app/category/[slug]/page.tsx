import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Star, SlidersHorizontal, Grid, List } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: {
    id: string;
    name: string;
    slug: string;
  }[];
  _count: {
    products: number;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  regularPrice: number;
  salePrice?: number;
  status: string;
  stockStatus: string;
  stockQuantity?: number;
  isFeatured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images?: {
    id: string;
    url: string;
    alt?: string;
    isMain: boolean;
    sortOrder: number;
  }[];
  reviews?: {
    id: string;
    rating: number;
  }[];
  _count?: {
    reviews: number;
  };
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

// Fetch category by slug
async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Fetch products by category
async function getProductsByCategory(
  categoryId: string,
  searchParams: CategoryPageProps['searchParams']
): Promise<{ products: Product[]; pagination: any }> {
  try {
    const params = new URLSearchParams();
    params.set('category', categoryId);
    params.set('status', 'ACTIVE');
    params.set('page', searchParams.page || '1');
    params.set('limit', searchParams.limit || '12');
    
    if (searchParams.sort) {
      // Handle sorting - you may need to adjust based on your API
      params.set('sort', searchParams.sort);
    }
    
    if (searchParams.minPrice) {
      params.set('minPrice', searchParams.minPrice);
    }
    
    if (searchParams.maxPrice) {
      params.set('maxPrice', searchParams.maxPrice);
    }
    
    if (searchParams.inStock === 'true') {
      params.set('stockStatus', 'IN_STOCK');
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?${params.toString()}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return { products: [], pagination: null };
    }
    
    const data = await response.json();
    return {
      products: data.success ? data.data : [],
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], pagination: null };
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  const title = `${category.name} - Shop ${category.name} Products`;
  const description = category.description || `Browse our collection of ${category.name} products. Find the best deals and latest items in ${category.name}.`;
  
  return {
    title,
    description,
    keywords: `${category.name}, products, shop, buy, ${category.name} deals`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: category.image ? [{ url: category.image, alt: category.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: category.image ? [category.image] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    notFound();
  }
  
  const { products, pagination } = await getProductsByCategory(category.id, searchParams);
  
  // Calculate price range for products
  const priceRange = products.length > 0 ? {
    min: Math.min(...products.map(p => Number(p.salePrice || p.regularPrice))),
    max: Math.max(...products.map(p => Number(p.salePrice || p.regularPrice)))
  } : { min: 0, max: 1000 };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {category.parent && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/category/${category.parent.slug}`}>
                    {category.parent.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Category Header */}
      <section className="container py-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {category.image && (
            <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground text-lg mb-4">{category.description}</p>
            )}
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {category._count.products} {category._count.products === 1 ? 'Product' : 'Products'}
              </Badge>
              {category.children && category.children.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {category.children.map((child) => (
                    <Link key={child.id} href={`/category/${child.slug}`}>
                      <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                        {child.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Main Content */}
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    min={priceRange.min}
                    max={priceRange.max}
                    step={10}
                    defaultValue={[priceRange.min, priceRange.max]}
                    className="mb-4"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-20"
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-20"
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Availability</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="in-stock" />
                    <label htmlFor="in-stock" className="text-sm font-medium">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                        {Array(rating).fill(null).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                        {Array(5 - rating).fill(null).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-muted-foreground" />
                        ))}
                        <span className="ml-1">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          
          {/* Products Grid */}
          <main className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {products.length} of {pagination?.total || 0} products
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
                  const currentPrice = product.salePrice ? Number(product.salePrice) : Number(product.regularPrice);
                  const originalPrice = product.salePrice ? Number(product.regularPrice) : null;
                  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
                  
                  // Calculate average rating
                  const averageRating = product.reviews && product.reviews.length > 0
                    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                    : 0;
                  
                  return (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                      <Card className="group hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="relative aspect-square overflow-hidden rounded-t-lg">
                            {mainImage ? (
                              <Image
                                src={mainImage.url}
                                alt={mainImage.alt || product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">No Image</span>
                              </div>
                            )}
                            
                            {discount > 0 && (
                              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                -{discount}%
                              </Badge>
                            )}
                            
                            {product.stockStatus === 'OUT_OF_STOCK' && (
                              <Badge className="absolute top-2 right-2 bg-gray-500">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            
                            {averageRating > 0 && (
                              <div className="flex items-center gap-1 mb-2">
                                <div className="flex">
                                  {Array(5).fill(null).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(averageRating)
                                          ? 'fill-primary text-primary'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  ({product._count?.reviews || 0})
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">
                                Rs {currentPrice.toFixed(2)}
                              </span>
                              {originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  Rs {originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            )}
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      href={`/category/${params.slug}?page=${page}`}
                      className={`px-3 py-2 rounded-md text-sm ${
                        page === pagination.page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}