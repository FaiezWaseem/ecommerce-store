'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ChevronDown, ChevronUp, Heart, Search, SlidersHorizontal, Star } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const categories = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Cameras",
  "Audio",
  "Gaming",
  "Wearables",
]

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "LG",
  "Bose",
  "Dell",
  "Lenovo",
  "Canon",
]

export default function SearchPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])

  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Search</span>
        </nav>
      </div>

      <div className="container py-6">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Sidebar / Filters */}
          <aside className={`lg:w-1/4 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox id={category} />
                      <label
                        htmlFor={category}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex items-center justify-between">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-20"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox id={brand} />
                      <label
                        htmlFor={brand}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-semibold">Rating</h3>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center mb-2">
                    <Checkbox id={`rating-${rating}`} />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="ml-2 flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {Array(rating)
                        .fill(null)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      {Array(5 - rating)
                        .fill(null)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-muted-foreground" />
                        ))}
                      <span className="ml-1">& Up</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Search and Sort Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                className="w-full sm:w-auto lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {isSidebarOpen ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
              <div className="flex w-full items-center sm:w-auto">
                <Input
                  placeholder="Search products..."
                  className="rounded-r-none"
                />
                <Button className="rounded-l-none">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating-high-low">Rating: High to Low</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(9)
                .fill(null)
                .map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src="/placeholder.svg"
                        alt="Product Name"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Product Name</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-medium text-primary">$99.99</span>
                        <span className="text-sm text-muted-foreground line-through">
                          $129.99
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        {Array(5)
                          .fill(null)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        <span className="text-sm text-muted-foreground">(123)</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="mx-1">
                Previous
              </Button>
              <Button variant="outline" className="mx-1">
                1
              </Button>
              <Button variant="outline" className="mx-1">
                2
              </Button>
              <Button variant="outline" className="mx-1">
                3
              </Button>
              <Button variant="outline" className="mx-1">
                Next
              </Button>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

