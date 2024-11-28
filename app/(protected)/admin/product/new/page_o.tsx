'use client'

import ImageGallery from "@/components/Dashboard/product/image-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Download, ImageIcon, Plus, Upload, Video, X } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

import {
  Search,
} from "lucide-react"

export default function AddProductPage() {
  const [attributes, setAttributes] = useState<string[]>([])
  const [linkedProducts, setLinkedProducts] = useState<string[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [isVirtual, setIsVirtual] = useState(false)
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [featuredVideoType, setFeaturedVideoType] = useState<'upload' | 'link'>('upload')
  const [featuredVideoLink, setFeaturedVideoLink] = useState('')

  const addAttribute = () => {
    setAttributes([...attributes, ''])
  }

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const addLinkedProduct = () => {
    setLinkedProducts([...linkedProducts, ''])
  }

  const removeLinkedProduct = (index: number) => {
    setLinkedProducts(linkedProducts.filter((_, i) => i !== index))
  }

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, ''])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
  }

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">

      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>

      </header>

      <h1 className="text-3xl font-bold">Add New Product</h1>
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product name</Label>
              <Input id="product-name" placeholder="Enter product name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Product description</Label>
              <Textarea id="product-description" placeholder="Enter product description" className="min-h-[200px]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="virtual-product"
                  checked={isVirtual}
                  onCheckedChange={(checked) => setIsVirtual(checked as boolean)}
                />
                <Label htmlFor="virtual-product">This is a virtual product</Label>
              </div>
            </div>
            {isVirtual && (
              <div className="space-y-2">
                <Label htmlFor="downloadable-file">Downloadable File</Label>
                <div className="flex items-center space-x-2">
                  <Input id="downloadable-file" type="file" className="flex-1" />
                  <Button type="button" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Upload the file that customers will download after purchase.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Product categories</Label>
              <div className="space-y-1">
                <Checkbox id="category-1" />
                <Label htmlFor="category-1" className="ml-2">Category 1</Label>
              </div>
              <div className="space-y-1">
                <Checkbox id="category-2" />
                <Label htmlFor="category-2" className="ml-2">Category 2</Label>
              </div>
              <div className="space-y-1">
                <Checkbox id="category-3" />
                <Label htmlFor="category-3" className="ml-2">Category 3</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product tags</Label>
              <Input placeholder="Add tags separated by commas" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="featured-product" />
                <Label htmlFor="featured-product">Add to featured products</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ImageGallery />

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="linked-products">Linked Products</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="regular-price">Regular price</Label>
                  <Input id="regular-price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale-price">Sale price</Label>
                  <Input id="sale-price" type="number" placeholder="0.00" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Tax status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taxable">Taxable</SelectItem>
                    <SelectItem value="shipping">Shipping only</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tax class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="reduced">Reduced rate</SelectItem>
                    <SelectItem value="zero">Zero rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="inventory" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Enter SKU" />
              </div>
              {!isVirtual && (
                <>
                  <div className="space-y-2">
                    <Label>Manage stock?</Label>
                    <RadioGroup defaultValue="no">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="manage-stock-yes" />
                        <Label htmlFor="manage-stock-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="manage-stock-no" />
                        <Label htmlFor="manage-stock-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock-quantity">Stock quantity</Label>
                    <Input id="stock-quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Allow backorders?</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select backorder option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">Do not allow</SelectItem>
                        <SelectItem value="notify">Allow, but notify customer</SelectItem>
                        <SelectItem value="yes">Allow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Stock status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instock">In stock</SelectItem>
                    <SelectItem value="outofstock">Out of stock</SelectItem>
                    {!isVirtual && <SelectItem value="onbackorder">On backorder</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-4">
              {!isVirtual ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input id="length" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input id="width" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Shipping class</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <p>This is a virtual product and does not require shipping.</p>
              )}
            </TabsContent>
            <TabsContent value="linked-products" className="space-y-4">
              {linkedProducts.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product1">Product 1</SelectItem>
                      <SelectItem value="product2">Product 2</SelectItem>
                      <SelectItem value="product3">Product 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => removeLinkedProduct(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addLinkedProduct}>
                <Plus className="mr-2 h-4 w-4" /> Add linked product
              </Button>
            </TabsContent>
            <TabsContent value="attributes" className="space-y-4">
              {attributes.map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Attribute {index + 1}</Label>
                    <Button variant="outline" size="icon" onClick={() => removeAttribute(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input placeholder="Attribute name" />
                  <Input placeholder="Attribute value(s)" />
                </div>
              ))}
              <Button variant="outline" onClick={addAttribute}>
                <Plus className="mr-2 h-4 w-4" /> Add attribute
              </Button>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-note">Purchase note</Label>
                <Textarea id="purchase-note" placeholder="Enter purchase note" />
              </div>
              <div className="space-y-2">
                <Label>Menu order</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Enable reviews</Label>
                <RadioGroup defaultValue="yes">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="reviews-yes" />
                    <Label htmlFor="reviews-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="reviews-no" />
                    <Label htmlFor="reviews-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Save Draft</Button>
        <Button>Publish</Button>
      </div>
    </div>
  )
}

