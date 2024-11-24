'use client';
import React from "react";
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
import { users } from '@/components/data-table/data'
import { VerticalDotsIcon } from "@/components/data-table/VerticalDotsIcon";

const INITIAL_VISIBLE_COLUMNS = ["id", "image", "name", "status", "price", "qty", "createdAt", "actions"];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const data = [
    {
        id: 1,
        name: 'Bedsheet',
        image: 'https://placehold.co/100x100.png',
        status: 'active',
        price: 100,
        qty: 10,
        createdAt: '2021-08-09T12:27:47'
    },
    {
        id: 2,
        name: 'Bedsheet',
        image: 'https://placehold.co/100x100.png',
        status: 'active',
        price: 100,
        qty: 10,
        createdAt: '2021-08-09T12:27:47'
    },
]

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "IMAGE", uid: "image" },
    { name: "NAME", uid: "name", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "PRICE", uid: "price", sortable: true },
    { name: "QTY", uid: "qty", sortable: true },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function AdminOrders() {

    const renderCell = (user: any, columnKey: string) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "image":
                return (
                    <Image src={cellValue} width="100px" height="100px" />
                );
            case "name":
            case "qty":
            case "createdAt":
            case "price":
                return (
                    <p className="text-bold text-tiny capitalize text-default-400">{cellValue}</p>
                );
            case "status":
                //@ts-ignore
                const color: "success" | "danger" | "warning" | "secondary" | "default" | "primary" | undefined = statusColorMap[user.status] || 'secondary';
                return (
                    <Chip className="capitalize" color={color} size="sm" variant="flat">
                        {cellValue}
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
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }

    return <div className="bg-white dark:bg-slate-900 min-h-screen">
        <AdminNav active="Orders" />
        <div className="p-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">Orders</h1>
            <p className="text-sm text-gray-500 mt-3">Admin View Orders</p>
            <hr className="mt-3" />
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <DataTable
                data={data}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                renderCell={renderCell}
                columns={columns}
                searchKey="name"
            />
        </div>

    </div>
}