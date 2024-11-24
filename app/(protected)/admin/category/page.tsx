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
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/data-table/VerticalDotsIcon";
import { useRouter } from "next/navigation";

const INITIAL_VISIBLE_COLUMNS = ["cat_name", "status", "actions"];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const data = [
    {
        id: 1,
        cat_name: 'Bedsheet',
        status: 'active'
    }
]

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "cat_name", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function AdminCategory() {

    const navigate = useRouter();

    const renderCell = (user: { [key: string]: any }, columnKey: string) => {
        const cellValue = user[columnKey];
        const statusColorMap: { [key: string]: string } = {
            active: 'success',
            paused: 'warning',
            vacation: 'info'
        };
        switch (columnKey) {
            case "cat_name":
                return (
                    <p>{cellValue}</p>
                );
            case "status":
                //@ts-ignore
                const color : "success" | "danger" | "warning" | "secondary" | "default" | "primary" | undefined = statusColorMap[user.status] || 'secondary';
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
        <AdminNav active="Category" />
        <main className="p-4">

            <div className="p-4">
                <h1 className="text-3xl font-bold text-black dark:text-white">Category</h1>
                <p className="text-sm text-gray-500 mt-3">Welcome to the admin Category</p>
                <hr className="mt-3" />
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DataTable
                    renderCell={renderCell}
                    data={data}
                    columns={columns}
                    INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                    searchKey="cat_name"
                    onAddNewClick={(()=> {
                        navigate.push('/admin/category/new')
                    })}
                />
            </div>
        </main>

    </div>
}