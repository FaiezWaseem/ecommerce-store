'use client';

import Link from "next/link"
import {
    ChevronLeft,

    Search,

    X,
    Plus
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import ImageGallery from "@/components/Dashboard/product/image-gallery";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddProduct() {

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
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid max-w-[85rem] flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
                            <Link href={'/admin/products'} >
                                <Button variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Back</span>
                                </Button>
                            </Link>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                New Product
                            </h1>
                            <Badge variant="outline" className="ml-auto sm:ml-0">
                                In stock
                            </Badge>
                            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                                <Button variant="outline" size="sm">
                                    Discard
                                </Button>
                                <Button size="sm">Save Product</Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card x-chunk="dashboard-07-chunk-0">
                                    <CardHeader>
                                        <CardTitle>Product Details</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    className="w-full"
                                                    defaultValue="Gamer Gear Pro Controller"
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                                                    className="min-h-32"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card x-chunk="dashboard-07-chunk-2">
                                    <CardHeader>
                                        <CardTitle>Product Category</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6 sm:grid-cols-3">
                                            <div className="grid gap-3">
                                                <Label htmlFor="category">Category</Label>
                                                <Select>
                                                    <SelectTrigger
                                                        id="category"
                                                        aria-label="Select category"
                                                    >
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="clothing">Clothing</SelectItem>
                                                        <SelectItem value="electronics">
                                                            Electronics
                                                        </SelectItem>
                                                        <SelectItem value="accessories">
                                                            Accessories
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="subcategory">
                                                    Subcategory (optional)
                                                </Label>
                                                <Select>
                                                    <SelectTrigger
                                                        id="subcategory"
                                                        aria-label="Select subcategory"
                                                    >
                                                        <SelectValue placeholder="Select subcategory" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                                                        <SelectItem value="hoodies">Hoodies</SelectItem>
                                                        <SelectItem value="sweatshirts">
                                                            Sweatshirts
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
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
                            </div>
                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                <Card x-chunk="dashboard-07-chunk-3">
                                    <CardHeader>
                                        <CardTitle>Product Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="status">Status</Label>
                                                <Select>
                                                    <SelectTrigger id="status" aria-label="Select status">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Active</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="featured-product" />
                                                    <Label htmlFor="featured-product">Add to featured products</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card
                                    className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                                >
                                    <CardHeader>
                                        <CardTitle>Product Images</CardTitle>

                                    </CardHeader>
                                    <CardContent>
                                        <ImageGallery />
                                        {/* <div className="grid gap-2">
                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="300"
                                                src="/placeholder.svg"
                                                width="300"
                                            />
                                            <div className="grid grid-cols-3 gap-2">
                                                <button>
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        height="84"
                                                        src="/placeholder.svg"
                                                        width="84"
                                                    />
                                                </button>
                                                <button>
                                                    <Image
                                                        alt="Product image"
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        height="84"
                                                        src="/placeholder.svg"
                                                        width="84"
                                                    />
                                                </button>
                                                <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                    <span className="sr-only">Upload</span>
                                                </button>
                                            </div>
                                        </div> */}
                                    </CardContent>
                                </Card>
                                <Card x-chunk="dashboard-07-chunk-5">
                                    <CardHeader>
                                        <CardTitle>Archive Product</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div></div>
                                        <Button size="sm" variant="secondary">
                                            Archive Product
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button variant="outline" size="sm">
                                Discard
                            </Button>
                            <Button size="sm">Save Product</Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

