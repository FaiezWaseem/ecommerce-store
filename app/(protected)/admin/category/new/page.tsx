'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Category {
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
    };
    children?: {
        id: string;
        name: string;
    }[];
    _count: {
        products: number;
    };
}



export default function AdminCategory() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
        parentId: 'none'
    });
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }
        if (!formData.slug.trim()) {
            toast.error('Category slug is required');
            return;
        }

        setLoading(true);
        try {
            let imageUrl = formData.image;
            
            // If file is selected, upload it first
            if (imageMode === 'upload' && selectedFile) {
                imageUrl = await uploadFile(selectedFile);
            }
            
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description || undefined,
                    image: imageUrl || undefined,
                    isActive: formData.isActive,
                    parentId: formData.parentId === 'none' ? undefined : formData.parentId
                }),
            });

            if (response.ok) {
                toast.success('Category created successfully');
                router.push('/admin/category');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to create category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            toast.error('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => {
            const updated = {
                ...prev,
                [field]: value
            };
            
            // Auto-generate slug when name changes
            if (field === 'name' && typeof value === 'string') {
                updated.slug = generateSlug(value);
            }
            
            return updated;
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setFormData(prev => ({ ...prev, image: file.name }));
        }
    };

    const handleImageModeChange = (mode: 'url' | 'upload') => {
        setImageMode(mode);
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, image: '' }));
    };

    // Upload file to public/category folder
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'category');

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

    return <div className="flex justify-center min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 container">
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
                                <Link href="/admin/category">Category</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Add Category</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Category</CardTitle>
                        <CardDescription>
                            Create a new category for your products.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-name">Category Name *</Label>
                            <Input
                                id="category-name"
                                placeholder="Enter category name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category-slug">Slug *</Label>
                            <Input
                                id="category-slug"
                                placeholder="category-slug"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                URL-friendly version of the name. Auto-generated from name but can be edited.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category-description">Description</Label>
                            <Textarea
                                id="category-description"
                                placeholder="Enter category description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Image</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={imageMode === 'url' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleImageModeChange('url')}
                                    >
                                        URL
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={imageMode === 'upload' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleImageModeChange('upload')}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>

                            {imageMode === 'url' ? (
                                <div className="space-y-2">
                                    <Input
                                        id="category-image-url"
                                        placeholder="Enter image URL"
                                        value={formData.image}
                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                    />
                                    {formData.image && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-md border"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        id="category-image-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                                    />
                                    {previewUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-md border"
                                            />
                                        </div>
                                    )}
                                    {selectedFile && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parent-category">Parent Category</Label>
                            <Select
                                value={formData.parentId}
                                onValueChange={(value) => handleInputChange('parentId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Parent</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is-active"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange('isActive', checked as boolean)}
                            />
                            <Label htmlFor="is-active">Active</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Save Category'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.push('/admin/category')}>
                            Cancel
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    </div>
}