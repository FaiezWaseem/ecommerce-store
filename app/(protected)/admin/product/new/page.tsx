'use client';

import Link from "next/link"
import {
    ChevronLeft,

    Search,
    Upload,
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
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        sku: '',
        regularPrice: '',
        salePrice: '',
        stockQuantity: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        status: 'DRAFT',
        isFeatured: false,
        manageStock: false,
        stockStatus: 'IN_STOCK',
        taxStatus: 'taxable',
        taxClass: 'standard',
        shippingClass: 'standard',
        allowBackorders: 'no',
        purchaseNote: '',
        menuOrder: 0,
        enableReviews: true
    });
    
    const [attributes, setAttributes] = useState<{name: string, value: string}[]>([]);
    const [linkedProducts, setLinkedProducts] = useState<string[]>([]);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [isVirtual, setIsVirtual] = useState(false);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [featuredVideoType, setFeaturedVideoType] = useState<'upload' | 'link'>('upload');
    const [featuredVideoLink, setFeaturedVideoLink] = useState('');
    const [featuredVideoFile, setFeaturedVideoFile] = useState<string | null>(null);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    
    // Color and Size options
    const [colors, setColors] = useState<{name: string, value: string}[]>([]);
    const [sizes, setSizes] = useState<{name: string, value: string}[]>([]);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories?limit=100');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addAttribute = () => {
        setAttributes([...attributes, { name: '', value: '' }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (index: number, field: 'name' | 'value', value: string) => {
        const updated = [...attributes];
        updated[index][field] = value;
        setAttributes(updated);
    };

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

    // Helper function to generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error('Product name is required');
            return;
        }
        
        if (!formData.categoryId) {
            toast.error('Please select a category');
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
                ...formData,
                slug: generateSlug(formData.name),
                regularPrice: parseFloat(formData.regularPrice) || 0,
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
                stockQuantity: parseInt(formData.stockQuantity) || 0,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                length: formData.length ? parseFloat(formData.length) : null,
                width: formData.width ? parseFloat(formData.width) : null,
                height: formData.height ? parseFloat(formData.height) : null,
                menuOrder: parseInt(formData.menuOrder.toString()) || 0,
                attributes: attributes.filter(attr => attr.name && attr.value),
                colors: colors.filter(color => color.name && color.value),
                sizes: sizes.filter(size => size.name && size.value),
                images: images,
                featuredVideoType: featuredVideoType.toUpperCase(),
                featuredVideoLink: featuredVideoType === 'link' ? featuredVideoLink : null,
                featuredVideoFile: featuredVideoType === 'upload' ? featuredVideoFile : null,
                isVirtual
            };

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                toast.success('Product created successfully!');
                router.push('/admin/products');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        router.push('/admin/products');
    };

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
                                <Button variant="outline" size="sm" onClick={handleDiscard} disabled={loading}>
                                    Discard
                                </Button>
                                <Button size="sm" onClick={handleSubmit} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Product'}
                                </Button>
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
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="Enter product name"
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    className="min-h-32"
                                                    placeholder="Enter product description"
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
                                                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                                                    <SelectTrigger
                                                        id="category"
                                                        aria-label="Select category"
                                                    >
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
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
                                                <TabsTrigger value="variants">Variants</TabsTrigger>
                                                <TabsTrigger value="linked-products">Linked Products</TabsTrigger>
                                                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                                                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="general" className="space-y-4">
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="regular-price">Regular price</Label>
                                                        <Input 
                                                            id="regular-price" 
                                                            type="number" 
                                                            placeholder="0.00" 
                                                            value={formData.regularPrice}
                                                            onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="sale-price">Sale price</Label>
                                                        <Input 
                                                            id="sale-price" 
                                                            type="number" 
                                                            placeholder="0.00" 
                                                            value={formData.salePrice}
                                                            onChange={(e) => handleInputChange('salePrice', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <Label>Tax status</Label>
                                                    <Select value={formData.taxStatus} onValueChange={(value) => handleInputChange('taxStatus', value)}>
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
                                                    <Input 
                                                        id="sku" 
                                                        placeholder="Enter SKU" 
                                                        value={formData.sku}
                                                        onChange={(e) => handleInputChange('sku', e.target.value)}
                                                    />
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
                                                            <Input 
                                                                id="stock-quantity" 
                                                                type="number" 
                                                                placeholder="0" 
                                                                value={formData.stockQuantity}
                                                                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                                                            />
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
                                                            <SelectItem value="IN_STOCK">In stock</SelectItem>
                                                             <SelectItem value="OUT_OF_STOCK">Out of stock</SelectItem>
                                                             {!isVirtual && <SelectItem value="ON_BACKORDER">On backorder</SelectItem>}
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
                                            <TabsContent value="variants" className="space-y-4">
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
                                                {attributes.map((attribute, index) => (
                                                    <div key={index} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>Attribute {index + 1}</Label>
                                                            <Button variant="outline" size="icon" onClick={() => removeAttribute(index)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <Input 
                                                            placeholder="Attribute name" 
                                                            value={attribute.name}
                                                            onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                                                        />
                                                        <Input 
                                                            placeholder="Attribute value(s)" 
                                                            value={attribute.value}
                                                            onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                                                        />
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
                                                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                                    <SelectTrigger id="status" aria-label="Select status">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox 
                                                        id="featured-product" 
                                                        checked={formData.isFeatured}
                                                        onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                                                    />
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
                                        <ImageGallery 
                            mainImage={mainImage || ''}
                            galleryImages={galleryImages}
                            onMainImageChange={setMainImage}
                            onGalleryImagesChange={setGalleryImages}
                        />
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
                                        <CardTitle>Featured Video</CardTitle>
                                        <CardDescription>
                                            Select A Video for product
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Label>Featured Video</Label>
                                            <div className="space-y-2">
                                                <RadioGroup defaultValue="upload" onValueChange={(value) => setFeaturedVideoType(value as 'upload' | 'link')}>
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
                                            {featuredVideoType === 'upload' ? (
                                                <div className="space-y-4">
                                                    {featuredVideoFile ? (
                                                        <div className="relative w-full">
                                                            <video 
                                                                src={featuredVideoFile} 
                                                                controls 
                                                                className="w-full h-auto rounded-md"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                                onClick={() => setFeaturedVideoFile(null)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <Input 
                                                                id="video-file" 
                                                                type="file" 
                                                                accept="video/*" 
                                                                className="flex-1" 
                                                                onChange={handleVideoUpload}
                                                                disabled={uploadingVideo}
                                                            />
                                                            <Button type="button" size="icon" disabled={uploadingVideo}>
                                                                {uploadingVideo ? (
                                                                    <span className="animate-spin">⏳</span>
                                                                ) : (
                                                                    <Upload className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Input
                                                    type="url"
                                                    placeholder="Enter YouTube, Facebook, or Vimeo URL"
                                                    value={featuredVideoLink}
                                                    onChange={(e) => setFeaturedVideoLink(e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button variant="outline" size="sm" onClick={handleDiscard} disabled={loading}>
                                Discard
                            </Button>
                            <Button size="sm" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Product'}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

