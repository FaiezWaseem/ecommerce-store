import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu, Search, ShoppingCart } from 'lucide-react'
import Link from "next/link"
import { SearchForm } from "@/components/search-form"



export default function Header(){

    return (
        <header className="border-b">
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
                      <Button variant="ghost" className="w-full justify-start">Women's Fashion</Button>
                      <Button variant="ghost" className="w-full justify-start">Men's Fashion</Button>
                      <Button variant="ghost" className="w-full justify-start">Electronics</Button>
                      <Button variant="ghost" className="w-full justify-start">Home & Lifestyle</Button>
                      <Button variant="ghost" className="w-full justify-start">Medicine</Button>
                      <Button variant="ghost" className="w-full justify-start">Sports & Outdoor</Button>
                      <Button variant="ghost" className="w-full justify-start">Baby's & Toys</Button>
                      <Button variant="ghost" className="w-full justify-start">Groceries & Pets</Button>
                      <Button variant="ghost" className="w-full justify-start">Health & Beauty</Button>
                    </div>
                  </div>
                  <SearchForm className="px-3 py-2" />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Link href="/" className="ml-4 md:ml-0">
            <h1 className="text-xl font-bold">Exclusive</h1>
          </Link>
          <div className="flex items-center space-x-4 ml-auto">
            <SearchForm className="hidden md:flex" />
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    )
}