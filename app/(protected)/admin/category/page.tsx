'use client';
import React, { useState, useEffect } from "react";
import AdminNav from "@/components/navbar/admin-nav"
import DataTable from "@/components/data-table"
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/data-table/VerticalDotsIcon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const INITIAL_VISIBLE_COLUMNS = ["name", "status", "products_count", "actions"];

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

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "PRODUCTS", uid: "products_count", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function AdminCategory() {
    const navigate = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            setDeleting(categoryId);
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete category');
            }

            toast.success('Category deleted successfully');
            fetchCategories(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast.error(error.message || 'Failed to delete category');
        } finally {
            setDeleting(null);
        }
    };

    const handleEdit = (categoryId: string) => {
        navigate.push(`/admin/category/${categoryId}`);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const renderCell = (category: any, columnKey: string) => {
        const cellValue = category[columnKey as keyof Category];
        const statusColorMap: { [key: string]: "success" | "danger" | "warning" | "secondary" | "default" | "primary" } = {
            true: 'success',
            false: 'danger'
        };
        
        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{category.name}</p>
                        {category.parent && (
                            <p className="text-bold text-sm capitalize text-default-400">
                                Parent: {category.parent.name}
                            </p>
                        )}
                    </div>
                );
            case "status":
                const color = statusColorMap[category.isActive.toString()] || 'secondary';
                return (
                    <Chip className="capitalize" color={color} size="sm" variant="flat">
                        {category.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                );
            case "products_count":
                return (
                    <p className="text-bold text-sm">{category._count.products}</p>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="light"
                                    isDisabled={deleting === category.id}
                                >
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    key="edit"
                                    onPress={() => handleEdit(category.id)}
                                >
                                    Edit
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    onPress={() => handleDelete(category.id)}
                                    isDisabled={deleting === category.id}
                                >
                                    {deleting === category.id ? 'Deleting...' : 'Delete'}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue as React.ReactNode;
        }
    }

    return <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Category" />
        <main className="p-4">

            <div className="p-4">
                <h1 className="text-3xl font-bold text-black dark:text-white">Category</h1>
                <p className="text-sm text-gray-500 mt-3">Welcome to the admin Category</p>
                <hr className="mt-3" />
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading categories...</div>
                    </div>
                ) : (
                    <DataTable
                        renderCell={renderCell}
                        data={categories}
                        columns={columns}
                        INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                        searchKey="name"
                        onAddNewClick={() => {
                            navigate.push('/admin/category/new')
                        }}
                    />
                )}
            </div>
        </main>

    </div>
}