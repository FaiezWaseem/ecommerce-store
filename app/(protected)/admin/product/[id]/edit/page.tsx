'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { Loader2, Plus, X } from 'lucide-react';
import ImageGallery from "@/components/Dashboard/product/image-gallery";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
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
  categoryId?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  stockQuantity?: number;
  manageStock: boolean;
  isVirtual: boolean;
  isFeatured: boolean;
  enableReviews: boolean;
  images: ProductImage[];
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

interface Attribute {
  name: string;
  value: string;
}

interface LinkedProduct {
  id: string;
  name: string;
}

interface Color {
  name: string;
  value: string;
}

interface Size {
  name: string;
  value: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    regularPrice: '',
    salePrice: '',
    categoryId: '',
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
    stockStatus: 'IN_STOCK' as 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER',
    stockQuantity: '',
    manageStock: false,
    isVirtual: false,
    isFeatured: false,
    enableReviews: true,
    taxStatus: 'taxable',
    purchaseNote: '',
    menuOrder: '0'
  });

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [linkedProducts, setLinkedProducts] = useState<LinkedProduct[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isVirtualProduct, setIsVirtualProduct] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');
  const [featuredVideoType, setFeaturedVideoType] = useState<'UPLOAD' | 'LINK'>('UPLOAD');
  const [featuredVideoLink, setFeaturedVideoLink] = useState('');
  const [featuredVideoFile, setFeaturedVideoFile] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  // Color and Size options
  const [colors, setColors] = useState<{name: string, value: string}[]>([]);
  const [sizes, setSizes] = useState<{name: string, value: string}[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const result = await response.json();
        const productData = result.data;

        console.log(productData)
        
        setProduct(productData);
        setFormData({
          name: productData.name || '',
          slug: productData.slug || '',
          description: productData.description || '',
          shortDescription: productData.shortDescription || '',
          sku: productData.sku || '',
          regularPrice: productData.regularPrice?.toString() || '',
          salePrice: productData.salePrice?.toString() || '',
          categoryId: productData.categoryId || '',
          status: productData.status || 'DRAFT',
          stockStatus: productData.stockStatus || 'IN_STOCK',
          stockQuantity: productData.stockQuantity?.toString() || '',
          manageStock: productData.manageStock || false,
          isVirtual: productData.isVirtual || false,
          isFeatured: productData.isFeatured || false,
          enableReviews: productData.enableReviews !== false,
          taxStatus: 'taxable',
          purchaseNote: '',
          menuOrder: '0'
        });
        
        // Set video data
        if (productData.featuredVideoType) {
          setFeaturedVideoType(productData.featuredVideoType);
          if (productData.featuredVideoType === 'LINK' && productData.featuredVideoLink) {
            setFeaturedVideoLink(productData.featuredVideoLink);
          } else if (productData.featuredVideoType === 'UPLOAD' && productData.featuredVideoFile) {
            setFeaturedVideoFile(productData.featuredVideoFile);
          }
        }
        
        setIsVirtualProduct(productData.isVirtual || false);
        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0].url);
          setGalleryImages(productData.images.map((img: ProductImage) => img.url));
        }
        
        // Set colors and sizes data
        if (productData.colors && productData.colors.length > 0) {
          setColors(productData.colors.map((color: any) => ({ name: color.name, value: color.value })));
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSizes(productData.sizes.map((size: any) => ({ name: size.name, value: size.value })));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
        router.push('/admin/products');
      } finally {
        setFetchLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: 'name' | 'value', value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setAttributes(updatedAttributes);
  };

  const addLinkedProduct = () => {
    setLinkedProducts([...linkedProducts, { id: '', name: '' }]);
  };

  const removeLinkedProduct = (index: number) => {
    setLinkedProducts(linkedProducts.filter((_, i) => i !== index));
  };

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Color management functions
  const addColor = () => {
    setColors([...colors, { name: '', value: '' }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  // Size management functions
  const addSize = () => {
    setSizes([...sizes, { name: '', value: '' }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'product');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.url; // Return the public URL of the uploaded file
  };

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        toast.loading('Uploading image...');
        const imageUrl = await uploadFile(file);
        setMainImage(imageUrl);
        toast.dismiss();
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to upload image');
        console.error('Upload error:', error);
      }
    }
  };
  
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadingVideo(true);
        toast.loading('Uploading video...');
        const videoUrl = await uploadFile(file);
        setFeaturedVideoFile(videoUrl);
        toast.dismiss();
        toast.success('Video uploaded successfully!');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to upload video');
        console.error('Upload error:', error);
      } finally {
        setUploadingVideo(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.regularPrice || isNaN(Number(formData.regularPrice))) {
      toast.error('Valid regular price is required');
      return;
    }

    setLoading(true);
    try {
      // Prepare images array
      const images = [];
      if (mainImage) {
        images.push({
          url: mainImage,
          alt: formData.name,
          isMain: true,
          sortOrder: 0
        });
      }
      
      // Add gallery images
      galleryImages.forEach((imageUrl, index) => {
        if (imageUrl && imageUrl !== mainImage) {
          images.push({
            url: imageUrl,
            alt: formData.name,
            isMain: false,
            sortOrder: index + 1
          });
        }
      });

      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        sku: formData.sku.trim(),
        regularPrice: Number(formData.regularPrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        categoryId: formData.categoryId || undefined,
        status: formData.status,
        stockStatus: formData.stockStatus,
        stockQuantity: formData.stockQuantity ? Number(formData.stockQuantity) : undefined,
        manageStock: formData.manageStock,
        isVirtual: formData.isVirtual,
        isFeatured: formData.isFeatured,
        enableReviews: formData.enableReviews,
        featuredVideoType: featuredVideoType.toUpperCase(),
        featuredVideoLink: featuredVideoType.toLowerCase() === 'link' ? featuredVideoLink : featuredVideoFile,
        attributes: attributes.filter(attr => attr.name.trim() && attr.value.trim()),
        colors: colors.filter(color => color.name.trim() && color.value.trim()),
        sizes: sizes.filter(size => size.name.trim() && size.value.trim()),
        images: images
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      toast.success('Product updated successfully!');
  
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    router.push('/admin/products');
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Button onClick={() => router.push('/admin/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information and settings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDiscard}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId || "none"} onValueChange={(value) => handleInputChange('categoryId', value === "none" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Data Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="linked-products">Linked Products</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="attributes">Attributes</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="regularPrice">Regular Price ($) *</Label>
                      <Input
                        id="regularPrice"
                        type="number"
                        step="0.01"
                        value={formData.regularPrice}
                        onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salePrice">Sale Price ($)</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => handleInputChange('salePrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="taxStatus">Tax Status</Label>
                    <Select value={formData.taxStatus} onValueChange={(value) => handleInputChange('taxStatus', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taxable">Taxable</SelectItem>
                        <SelectItem value="shipping">Shipping only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="manageStock"
                      checked={formData.manageStock}
                      onCheckedChange={(checked) => handleInputChange('manageStock', checked)}
                    />
                    <Label htmlFor="manageStock">Track quantity for this product</Label>
                  </div>
                  {formData.manageStock && (
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Stock Status</Label>
                    <RadioGroup
                      value={formData.stockStatus}
                      onValueChange={(value) => handleInputChange('stockStatus', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="IN_STOCK" id="in-stock" />
                        <Label htmlFor="in-stock">In stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OUT_OF_STOCK" id="out-of-stock" />
                        <Label htmlFor="out-of-stock">Out of stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ON_BACKORDER" id="on-backorder" />
                        <Label htmlFor="on-backorder">On backorder</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input id="length" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input id="width" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" placeholder="0" className="w-1/3" />
                  </div>
                </TabsContent>

                <TabsContent value="linked-products" className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Linked Products</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addLinkedProduct}>
                        Add Product
                      </Button>
                    </div>
                    {linkedProducts.map((product, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="Search products..."
                          value={product.name}
                          onChange={(e) => {
                            const updated = [...linkedProducts];
                            updated[index] = { ...updated[index], name: e.target.value };
                            setLinkedProducts(updated);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLinkedProduct(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="p-6 space-y-4">
                  <div className="space-y-6">
                    {/* Colors Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Colors (Optional)</Label>
                        <Button variant="outline" size="sm" onClick={addColor}>
                          <Plus className="mr-2 h-4 w-4" /> Add Color
                        </Button>
                      </div>
                      {colors.map((color, index) => (
                        <div key={index} className="space-y-2 p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label>Color {index + 1}</Label>
                            <Button variant="outline" size="icon" onClick={() => removeColor(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`color-name-${index}`}>Color Name</Label>
                              <Input 
                                id={`color-name-${index}`}
                                placeholder="e.g., Red, Blue, Green" 
                                value={color.name}
                                onChange={(e) => updateColor(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`color-value-${index}`}>Color Code/Value</Label>
                              <div className="flex gap-2">
                                <Input 
                                  id={`color-value-${index}`}
                                  placeholder="#FF0000 or red" 
                                  value={color.value}
                                  onChange={(e) => updateColor(index, 'value', e.target.value)}
                                />
                                {color.value && color.value.startsWith('#') && (
                                  <div 
                                    className="w-10 h-10 rounded border border-gray-300" 
                                    style={{ backgroundColor: color.value }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {colors.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No colors added yet. Click "Add Color" to add color options for this product.
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Sizes Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Sizes (Optional)</Label>
                        <Button variant="outline" size="sm" onClick={addSize}>
                          <Plus className="mr-2 h-4 w-4" /> Add Size
                        </Button>
                      </div>
                      {sizes.map((size, index) => (
                        <div key={index} className="space-y-2 p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label>Size {index + 1}</Label>
                            <Button variant="outline" size="icon" onClick={() => removeSize(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`size-name-${index}`}>Size Name</Label>
                              <Input 
                                id={`size-name-${index}`}
                                placeholder="e.g., Small, Medium, Large" 
                                value={size.name}
                                onChange={(e) => updateSize(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`size-value-${index}`}>Size Value</Label>
                              <Input 
                                id={`size-value-${index}`}
                                placeholder="S, M, L, XL or 32, 34, 36" 
                                value={size.value}
                                onChange={(e) => updateSize(index, 'value', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {sizes.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No sizes added yet. Click "Add Size" to add size options for this product.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attributes" className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Custom Attributes</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                        Add Attribute
                      </Button>
                    </div>
                    {attributes.map((attribute, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 items-center">
                        <Input
                          placeholder="Attribute name"
                          value={attribute.name}
                          onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Attribute value"
                            value={attribute.value}
                            onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAttribute(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="purchaseNote">Purchase Note</Label>
                    <Textarea
                      id="purchaseNote"
                      value={formData.purchaseNote}
                      onChange={(e) => handleInputChange('purchaseNote', e.target.value)}
                      placeholder="Enter purchase note"
                    />
                  </div>
                  <div>
                    <Label htmlFor="menuOrder">Menu Order</Label>
                    <Input
                      id="menuOrder"
                      type="number"
                      value={formData.menuOrder}
                      onChange={(e) => handleInputChange('menuOrder', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enableReviews"
                      checked={formData.enableReviews}
                      onCheckedChange={(checked) => handleInputChange('enableReviews', checked)}
                    />
                    <Label htmlFor="enableReviews">Enable reviews</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">Add to featured products</Label>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery 
                  mainImage={mainImage}
                  galleryImages={galleryImages}
                  onMainImageChange={setMainImage}
                  onGalleryImagesChange={setGalleryImages}
                />
            </CardContent>
          </Card>

          {/* Featured Video */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Video Source</Label>
                <RadioGroup 
                  value={featuredVideoType?.toLowerCase() || "upload"} 
                  onValueChange={(value : any) => setFeaturedVideoType(value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="video-upload" />
                    <Label htmlFor="video-upload">Upload Video</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="video-link" />
                    <Label htmlFor="video-link">Video Link</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {featuredVideoType.toLowerCase() === "upload" ? (
                <div>
                  {featuredVideoFile ? (
                    <div className="space-y-2">
                      <video 
                        src={featuredVideoFile} 
                        controls 
                        className="w-full h-auto border rounded-md"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFeaturedVideoFile(null)}
                      >
                        Remove Video
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="video-file">Upload Video File</Label>
                      <Input
                        id="video-file"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="mt-1"
                      />
                      {uploadingVideo && (
                        <div className="flex items-center mt-2">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span className="text-sm">Uploading video...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <Input 
                    id="video-url"
                    placeholder="Video URL (YouTube, Facebook, Vimeo)" 
                    value={featuredVideoLink || ""}
                    onChange={(e) => setFeaturedVideoLink(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Archive Product */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Archive Product</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Archiving will hide this product from your store.
              </p>
              <Button variant="destructive" className="w-full">
                Archive Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}