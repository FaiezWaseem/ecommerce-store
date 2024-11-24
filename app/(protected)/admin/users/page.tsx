'use client';
import React from "react";
import AdminNav from "@/components/navbar/admin-nav"
import DataTable  from "@/components/data-table"
import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
  } from "@nextui-org/react";
import { users } from '@/components/data-table/data'
import {VerticalDotsIcon} from "@/components/data-table/VerticalDotsIcon";

const INITIAL_VISIBLE_COLUMNS = ["id", "name", 'role' , 'team' , 'age', 'email' , "status", "actions"];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "AGE", uid: "age", sortable: true},
    {name: "ROLE", uid: "role", sortable: true},
    {name: "TEAM", uid: "team"},
    {name: "EMAIL", uid: "email"},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "ACTIONS", uid: "actions"},
  ];

export default function AdminUsers() {

    const renderCell = (user  : any , columnKey : string) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
          case "name":
            return (
              <User
                avatarProps={{radius: "lg", src: user.avatar}}
                description={user.email}
                name={cellValue}
              >
                {user.email}
              </User>
            );
          case "role":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">{cellValue}</p>
                <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
              </div>
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
        <AdminNav active="Users" />
        <div className="p-4">
            <h1 className="text-3xl font-bold text-black dark:text-white">Users</h1>
            <p className="text-sm text-gray-500 mt-3">Admin View Users</p>
            <hr className="mt-3" />
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <DataTable 
             data={users}
             INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
             renderCell={renderCell}
             columns={columns}
             searchKey="name"
            />
        </div>

    </div>
}