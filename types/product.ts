export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  regularPrice: number;
  salePrice?: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  stockQuantity?: number;
  isFeatured: boolean;
  enableReviews: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  image : string;
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
    comment?: string;
    user: {
      firstName?: string;
      lastName?: string;
    };
  }[];
  attributes?: {
    id: string;
    name: string;
    value: string;
  }[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brands?: string[];
  inStock?: boolean;
  page?: number;
  limit?: number;
  sort?: 'price-low-high' | 'price-high-low' | 'rating-high-low' | 'newest';
}

export interface ProductSearchResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
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
  _count?: {
    products: number;
  };
}