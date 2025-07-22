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
    Image,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/data-table/VerticalDotsIcon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const INITIAL_VISIBLE_COLUMNS = ["image", "name", "sku", "category", "price", "status", "stock", "createdAt", "actions"];

const statusColorMap = {
    ACTIVE: "success",
    DRAFT: "warning",
    ARCHIVED: "danger",
};

const stockStatusColorMap = {
    IN_STOCK: "success",
    OUT_OF_STOCK: "danger",
    ON_BACKORDER: "warning",
};

interface Product {
    id: string;
    name: string;
    slug: string;
    regularPrice: number;
    salePrice?: number;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
    stockQuantity?: number;
    sku?: string;
    createdAt: string;
    category?: {
        id: string;
        name: string;
    };
    images: {
        id: string;
        url: string;
        altText?: string;
    }[];
    _count: {
        reviews: number;
    };
}

const columns = [
    { name: "IMAGE", uid: "image" },
    { name: "NAME", uid: "name", sortable: true },
    { name: "SKU", uid: "sku", sortable: true },
    { name: "CATEGORY", uid: "category" },
    { name: "PRICE", uid: "price", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "STOCK", uid: "stock" },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function AdminProducts() {
    const navigate = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async (currentPage = 1, search = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(search && { search }),
            });
            
            const response = await fetch(`/api/search?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setProducts(data.data);
                setTotalPages(data.pagination.pages);
                setPage(currentPage);
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Product deleted successfully');
                fetchProducts(page);
            } else {
                toast.error(data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const renderCell = (product: any, columnKey: string) => {
        switch (columnKey) {
            case "image":
                const imageUrl = product.images?.[0]?.url || 'https://placehold.co/100x100.png';
                return (
                    <Image 
                        src={imageUrl} 
                        width="60px" 
                        height="60px" 
                        className="rounded-lg object-cover"
                        alt={product.name}
                    />
                );
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">{product.name}</p>
                        <p className="text-tiny text-default-400">{product.slug}</p>
                    </div>
                );
            case "sku":
                return (
                    <p className="text-sm">{product.sku || 'N/A'}</p>
                );
            case "category":
                return (
                    <p className="text-sm">{product.category?.name || 'Uncategorized'}</p>
                );
            case "price":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">${product.regularPrice}</p>
                        {product.salePrice && (
                            <p className="text-tiny text-success">${product.salePrice}</p>
                        )}
                    </div>
                );
            case "status":
                //@ts-ignore
                const statusColor = statusColorMap[product.status] || 'secondary';
                return (
                    <Chip className="capitalize" color={statusColor as any} size="sm" variant="flat">
                        {product.status.toLowerCase()}
                    </Chip>
                );
            case "stock":
                //@ts-ignore
                const stockColor = stockStatusColorMap[product.stockStatus] || 'secondary';
                return (
                    <div className="flex flex-col">
                        <Chip className="capitalize" color={stockColor as any} size="sm" variant="flat">
                            {product.stockStatus.replace('_', ' ').toLowerCase()}
                        </Chip>
                        {product.stockQuantity !== undefined && (
                            <p className="text-tiny text-default-400">Qty: {product.stockQuantity}</p>
                        )}
                    </div>
                );
            case "createdAt":
                return (
                    <p className="text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem 
                                    key="view"
                                    onClick={() => navigate.push(`/product/${product.slug}`)}
                                >
                                    View
                                </DropdownItem>
                                <DropdownItem 
                                    key="edit"
                                    onClick={() => navigate.push(`/admin/product/${product.id}/edit`)}
                                >
                                    Edit
                                </DropdownItem>
                                <DropdownItem 
                                    key="delete"
                                    className="text-danger" 
                                    color="danger"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return null;
        }
    }

    return <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Products" />
        <div className="p-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">Products</h1>
            <p className="text-sm text-gray-500 mt-3">Admin View Products</p>
            <hr className="mt-3" />
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <DataTable
                data={products}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                renderCell={renderCell}
                columns={columns}
                searchKey="name"
                onAddNewClick={() => {
                    navigate.push('/admin/product/new')
                }}
                // loading={loading}
                // onSearch={(search : any) => fetchProducts(1, search)}
            />
        </div>

    </div>
}