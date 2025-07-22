import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// Fetch all active categories
async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories?isActive=true&limit=100`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Shop by Category - Browse All Product Categories',
  description: 'Explore our wide range of product categories. Find exactly what you\'re looking for from electronics to clothing and more.',
  keywords: 'categories, shop, products, electronics, clothing, browse',
  openGraph: {
    title: 'Shop by Category - Browse All Product Categories',
    description: 'Explore our wide range of product categories. Find exactly what you\'re looking for from electronics to clothing and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop by Category - Browse All Product Categories',
    description: 'Explore our wide range of product categories. Find exactly what you\'re looking for from electronics to clothing and more.',
  },
};

export default async function CategoriesPage() {
  const allCategories = await getCategories();
  
  // Separate parent categories and subcategories
  const parentCategories = allCategories.filter(cat => !cat.parentId);
  const subcategories = allCategories.filter(cat => cat.parentId);
  
  // Group subcategories by parent
  const categoriesWithChildren = parentCategories.map(parent => ({
    ...parent,
    children: subcategories.filter(sub => sub.parentId === parent.id)
  }));
  
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
            <BreadcrumbItem>
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* Page Header */}
      <section className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products organized by category. 
            {"Find exactly what you're looking for with ease."}
          </p>
        </div>
      </section>
      
      {/* Categories Grid */}
      <section className="container pb-16">
        {categoriesWithChildren.length > 0 ? (
          <div className="space-y-12">
            {categoriesWithChildren.map((category) => (
              <div key={category.id} className="space-y-6">
                {/* Parent Category */}
                <div className="border-b pb-6">
                  <Link href={`/category/${category.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          {category.image ? (
                            <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl font-bold text-muted-foreground">
                                {category.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {category.name}
                            </h2>
                            {category.description && (
                              <p className="text-muted-foreground mb-3">
                                {category.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">
                                {category._count.products} {category._count.products === 1 ? 'Product' : 'Products'}
                              </Badge>
                              {category.children && category.children.length > 0 && (
                                <Badge variant="outline">
                                  {category.children.length} {category.children.length === 1 ? 'Subcategory' : 'Subcategories'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
                
                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ml-6">
                    {category.children.map((subcategory) => {
                      // Find the full subcategory data
                      const fullSubcategory = subcategories.find(sub => sub.id === subcategory.id);
                      
                      return (
                        <Link key={subcategory.id} href={`/category/${subcategory.slug}`}>
                          <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                            <CardContent className="p-4">
                              <div className="text-center">
                                {fullSubcategory?.image ? (
                                  <div className="w-16 h-16 relative rounded-lg overflow-hidden mx-auto mb-3">
                                    <Image
                                      src={fullSubcategory.image}
                                      alt={subcategory.name}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-lg font-bold text-muted-foreground">
                                      {subcategory.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                
                                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                  {subcategory.name}
                                </h3>
                                
                                {fullSubcategory && (
                                  <Badge variant="secondary" className="text-xs">
                                    {fullSubcategory._count.products} {fullSubcategory._count.products === 1 ? 'Product' : 'Products'}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">Categories will appear here once they are added.</p>
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
}