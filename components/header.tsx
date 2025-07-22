"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu, Search, ShoppingCart, User } from 'lucide-react'
import Link from "next/link"
import { SearchForm } from "@/components/search-form"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface Category {
  id: string
  name: string
  slug: string
  isActive: boolean
}



export default function Header(){
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const { user, loading: authLoading } = useAuth()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories?isActive=true&limit=20')
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data.categories || [])
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <header className="border-b sticky top-0 z-40 md:static bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex h-16 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 text-lg font-semibold">Categories</h2>
                    <div className="space-y-1">
                      {loading ? (
                        <div className="space-y-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="h-9 bg-gray-200 rounded animate-pulse" />
                          ))}
                        </div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <Link key={category.id} href={`/category/${category.slug}`}>
                            <Button variant="ghost" className="w-full justify-start">
                              {category.name}
                            </Button>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No categories available</p>
                      )}
                    </div>
                  </div>
                  <SearchForm className="px-3 py-2" />
                  <div className="px-3 py-2 space-y-2">
                    <h3 className="text-sm font-medium">Account</h3>
                    {!authLoading && (
                      user ? (
                        <Link href="/account">
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            My Account
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/login">
                          <Button variant="outline" className="w-full">
                            Login
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Link href="/" className="ml-4 md:ml-0">
            <h1 className="text-xl font-bold">E-Shop</h1>
          </Link>
          <div className="flex items-center space-x-4 ml-auto">
            <SearchForm className="hidden md:flex" />
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {!authLoading && (
              user ? (
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </header>
    )
}