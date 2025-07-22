'use client'
import React from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, Button, Badge } from "@nextui-org/react"
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { Menu, Home, Package, ShoppingCart, Users, Grid3X3, Bell, Settings, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import DarkModeSwitcher from "@/components/darkmodeswitch/dark-mode-switcher"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminNavProps {
  active: string
}

export default function AdminNav({ active }: AdminNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const menuItems = [
    { title: "Dashboard", href: '/admin', icon: Home },
    { title: "Home Settings", href: '/admin/home-settings', icon: Settings },
    { title: "Category", href: '/admin/category', icon: Grid3X3 },
    { title: "Products", href: '/admin/products', icon: Package },
    { title: "Users", href: '/admin/users', icon: Users },
    { title: "Orders", href: '/admin/orders', icon: ShoppingCart },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <Navbar className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700" maxWidth="full">
      {/* Brand/Logo */}
      <NavbarContent justify="start">
        <NavbarBrand className="hidden sm:flex">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Admin</span>
          </Link>
        </NavbarBrand>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Open menu" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="h-full overflow-y-auto bg-white dark:bg-slate-900">
                {/* Mobile Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage your store</p>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <div className="p-4">
                  <nav className="space-y-2">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      return (
                        <Link 
                          key={index} 
                          href={item.href} 
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            active 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className={`h-5 w-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                          <span>{item.title}</span>
                          {item.title === 'Orders' && (
                            <Badge color="danger" size="sm" className="ml-auto">3</Badge>
                          )}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent justify="center" className="hidden md:flex">
        <div className="flex items-center gap-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                  active 
                    ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.title}</span>
                {item.title === 'Orders' && (
                  <Badge color="danger" size="sm" className="absolute -top-1 -right-1">3</Badge>
                )}
              </Link>
            )
          })}
        </div>
      </NavbarContent>

      {/* Right-side: Notifications, Dark Mode & Profile */}
      <NavbarContent justify="end">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <Badge color="danger" size="sm" className="absolute -top-1 -right-1">5</Badge>
        </Button>
        
        <DarkModeSwitcher />
        
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform hover:scale-105"
              color="primary"
              name="Admin User"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" className="w-64">
            <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile info">
              <div className="flex items-center gap-3">
                <Avatar
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem key="settings" startContent={<Settings className="h-4 w-4" />}>
              Settings
            </DropdownItem>
            <DropdownItem key="logout" color="danger" startContent={<LogOut className="h-4 w-4" />}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  )
}