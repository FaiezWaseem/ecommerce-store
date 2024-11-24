'use client';
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, DropdownItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@nextui-org/react";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu } from "@nextui-org/react";
import DarkModeSwitcher from "@/components/darkmodeswitch/dark-mode-switcher";
import Link from "next/link";

interface AdminNavProps {
  active: string;
}

export default function AdminNav({ active }: AdminNavProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { title: "Dashboard", href: '/admin' },
    { title: "Category", href: '/admin/category' },
    { title: "Products", href: '/admin/products' },
    { title: "Users", href: '/admin/users' },
    { title: "Orders", href: '/admin/orders' },

  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered className="bg-white dark:bg-slate-800" >
      <NavbarContent className="hidden" id="navbar-content-menu">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className=" text-black dark:text-white"
        />
      </NavbarContent>
      <NavbarContent  >
        <NavbarBrand>
          <p className="font-bold text-black dark:text-white">Store Admin</p>
        </NavbarBrand>
      </NavbarContent>


      <NavbarContent justify="end" className="hidden lg:flex">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full ${(active === item.title) ? "font-bold text-black dark:text-white" : "font-medium text-slate-500 dark:text-gray-400 text-small"}`}
              href={item.href}
           
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <DarkModeSwitcher />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2 text-slate-900 dark:text-white">
              <p className="font-semibol">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings" className="text-slate-900 dark:text-white" >Profile</DropdownItem>
            <DropdownItem key="logout" color="danger" className="text-slate-900 dark:text-white" >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

      </NavbarContent>

      <NavbarMenu >
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full ${(active === item.title) ? "font-bold text-black dark:text-white" : "font-medium text-slate-500 dark:text-gray-400 text-small"}`}
              href={item.href}
           
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
