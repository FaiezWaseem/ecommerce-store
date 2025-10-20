'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    Spinner,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/data-table/VerticalDotsIcon";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
}

const INITIAL_VISIBLE_COLUMNS = ["orderNumber", "customer", "status", "totalAmount", "itemCount", "createdAt", "actions"];

const statusColorMap = {
    PENDING: "warning",
    PROCESSING: "primary",
    SHIPPED: "secondary",
    DELIVERED: "success",
    CANCELLED: "danger",
};

const columns = [
    { name: "ORDER #", uid: "orderNumber", sortable: true },
    { name: "CUSTOMER", uid: "customer", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "TOTAL", uid: "totalAmount", sortable: true },
    { name: "ITEMS", uid: "itemCount", sortable: true },
    { name: "DATE", uid: "createdAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function AdminOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/orders?limit=50');
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (orderId: string) => {
        router.push(`/admin/orders/${orderId}`);
    };

    const renderCell = (order: Order, columnKey: string) => {
        const cellValue = order[columnKey as keyof Order];
        switch (columnKey) {
            case "orderNumber":
                return (
                    <p className="text-bold text-sm text-default-900">{order.orderNumber}</p>
                );
            case "customer":
                return (
                    <div>
                        <p className="text-bold text-sm text-default-900">
                            {order.user.firstName} {order.user.lastName}
                        </p>
                        <p className="text-tiny text-default-400">{order.user.email}</p>
                    </div>
                );
            case "totalAmount":
                return (
                    <p className="text-bold text-sm text-default-900">Rs {order.totalAmount}</p>
                );
            case "itemCount":
                return (
                    <p className="text-bold text-sm text-default-900">{order.items.length} items</p>
                );
            case "createdAt":
                return (
                    <p className="text-bold text-sm text-default-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                );
            case "status":
                //@ts-ignore
                const color: "success" | "danger" | "warning" | "secondary" | "default" | "primary" | undefined = statusColorMap[order.status] || 'secondary';
                return (
                    <Chip className="capitalize" color={color} size="sm" variant="flat">
                        {order.status.toLowerCase()}
                    </Chip>
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
                                <DropdownItem onClick={() => handleViewOrder(order.id)}>
                                    View Details
                                </DropdownItem>
                                <DropdownItem onClick={() => handleViewOrder(order.id)}>
                                    Edit Order
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 min-h-screen">
                <AdminNav active="Orders" />
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-slate-900 min-h-screen">
                <AdminNav active="Orders" />
                <div className="p-4">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Orders" />
        <div className="p-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">Orders</h1>
            <p className="text-sm text-gray-500 mt-3">Admin View Orders ({orders.length} total)</p>
            <hr className="mt-3" />
        </div>
        <div className="flex-1 space-y-4 p-2 lg:p-8 pt-6">
            {/* Mobile list layout */}
            <div className="md:hidden">
                {orders.length === 0 ? (
                    <div className="text-center text-sm text-gray-500">No orders found.</div>
                ) : (
                    <div className="space-y-3 mb-[120px]">
                        {orders.map((o) => {
                            const customerName = `${o.user.firstName} ${o.user.lastName}`.trim();
                            const statusColor = (statusColorMap as any)[o.status] || 'secondary';
                            return (
                                <div
                                    key={o.id}
                                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-default-900">Order #{o.orderNumber}</p>
                                            <p className="text-xs text-default-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <Chip className="capitalize" color={statusColor} size="sm" variant="flat">
                                            {o.status.toLowerCase()}
                                        </Chip>
                                    </div>

                                    <div className="mt-3">
                                        <User
                                            avatarProps={{ radius: "lg", name: customerName.charAt(0) }}
                                            name={customerName}
                                            description={o.user.email}
                                        />
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Items</p>
                                            <p className="font-medium">{o.items.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-medium">Rs {o.totalAmount}</p>
                                        </div>
                                    </div>

                                    {o.items.length > 0 && (
                                        <div className="mt-3 flex gap-2 overflow-x-auto py-1">
                                            {o.items.slice(0, 6).map((it) => (
                                                <Image
                                                    key={it.id}
                                                    alt={it.product.name}
                                                    src={it.product.images?.[0]?.url || "/placeholder.svg"}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-4 flex gap-2">
                                        <Button size="sm" color="primary" onPress={() => handleViewOrder(o.id)}>
                                            View
                                        </Button>
                                        <Button size="sm" variant="flat" onPress={() => handleViewOrder(o.id)}>
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
                <DataTable
                    data={orders}
                    INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                    renderCell={renderCell as any}
                    columns={columns}
                    searchKey="orderNumber"
                />
            </div>
        </div>
    </div>
}