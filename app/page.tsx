import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Heart } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye, Star, Truck, HeadphonesIcon, Shield } from 'lucide-react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import CrousalHero from "@/components/HomeScreen/crousal-hero"
import Categories from "@/components/HomeScreen/categories"
import FlashSale from "@/components/HomeScreen/flash-sale"
import { products } from "./constants"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Banner */}
      <div className="bg-black text-white p-2 text-center text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
        <Link href="#" className="underline">
          ShopNow
        </Link>
      </div>

      {/* Header */}
      <Header />

      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 lg:px-8 max-w-full">
          {/* Desktop Sidebar & Main Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">{"Women's Fashion"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Men's Fashion"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Electronics"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Home & Lifestyle"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Medicine"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Sports & Outdoor"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Baby's & Toys"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Groceries & Pets"}</Button>
                <Button variant="ghost" className="w-full justify-start">{"Health & Beauty"}</Button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Hero Carousel */}
              <CrousalHero />
            </div>
          </div>

          {/* Full width sections */}
          <div className="mt-6 space-y-6">
            {/* Flash Sales */}
            <FlashSale />

            <div className="w-full">
              <img src="./assets/banner/Orange and White Modern Furniture Promo Mobile Banner Ads.png" 
               className="w-full"
              alt="Orange and White Modern Furniture Promo Mobile Banner Ads" />
            </div>
        
            {/* Browse By Category */}
            <Categories />

            {/* Best Selling Products */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">This Month</h3>
                  <h2 className="text-2xl font-bold text-app_red">Best Selling Products</h2>
                </div>
                <Button className="bg-app_red hover:bg-red-600">View All</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((item, index) => (
                  <Link href={`/product/${item.title}-${index}`} key={item.title} className="group">
                  <Card key={item.title} className="group-hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image}
                          alt="Product"
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate text-app_red">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-bold">${item.sale_price}</span>
                          <span className="text-sm text-muted-foreground line-through">${item.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Enhance Your Music Experience */}
            <section className="relative h-[400px] bg-black rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-between p-12">
                <div className="text-white space-y-4">
                  <span className="text-app_red">Categories</span>
                  <h2 className="text-4xl font-bold">Enhance Your<br />Music Experience</h2>
                  <div className="flex gap-4 lg:gap-8">
                    {[
                      { value: '23', label: 'Hours' },
                      { value: '05', label: 'Days' },
                      { value: '59', label: 'Minutes' },
                      { value: '35', label: 'Seconds' },
                    ].map((item) => (
                      <div key={item.label} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white text-black flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm font-bold">{item.value}</div>
                          <div className="text-xs">{item.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="bg-app_red hover:bg-red-600">Buy Now!</Button>
                </div>
                <Image
                  src="/assets/images/JBL_BOOMBAX.png"
                  alt="Speaker"
                  width={400}
                  height={400}
                  className="hidden md:block"
                />
              </div>
            </section>

            {/* Explore Our Products */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-primary font-semibold mb-1 ">Our Products</h3>
                  <h2 className="text-2xl font-bold text-app_red">Explore Our Products</h2>
                </div>
                <div className="flex gap-2">

                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: "Gaming Console", price: "$99.99", rating: 5 },
                  { name: "DSLR Camera", price: "$699.99", rating: 4 },
                  { name: "Gaming Laptop", price: "$999.99", rating: 5 },
                  { name: "Running Shoes", price: "$79.99", rating: 4 },
                  { name: "RC Car", price: "$49.99", rating: 5 },
                  { name: "Sports Shoes", price: "$89.99", rating: 4 },
                  { name: "Game Controller", price: "$59.99", rating: 5 },
                  { name: "Winter Jacket", price: "$129.99", rating: 4 },
                ].map((product, index) => (
                  <Link href={`/product/${index}`} key={index}>
                    <Card key={index}>
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <Image
                            src="/placeholder.svg"
                            alt={product.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 left-2 h-8 w-8 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-primary font-bold text-app_red">{product.price}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {Array(product.rating).fill(null).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-400 text-primary" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
            
            <div className="w-full">
              <img src="./assets/banner/BlESSED.png" 
               className="w-full"
              alt="BlESSED.png" />
            </div>

            {/* New Arrival */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-[400px] bg-black rounded-lg overflow-hidden">
                <div className="absolute z-10 inset-0 p-8 flex flex-col justify-center text-white">
                  <h3 className="text-3xl font-bold mb-4">PlayStation 5</h3>
                  <p className="mb-4">Black and White Version of PS5 Coming Out</p>
                  <button className="flex items-center gap-4 text-color-text-1 bg-transparent text-white">
                    <p className="underline capitalize underline-offset-[10px] text-lg max-2xl:text-base">shop now</p>
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="w-6 h-6 opacity-0 -translate-x-4 duration-300 ease-in-out transition-all group-hover:translate-x-0 group-hover:opacity-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path></svg>
                  </button>
                </div>
                <Image
                  src="/assets/images/ps5.png"
                  alt="PS5"
                  fill
                  className="opacity-75"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative col-span-2 h-[185px] bg-black rounded-lg overflow-hidden">
                  <div className="col-span-2 flex items-end p-10 rounded-sm bg-[url(/assets/images/women.png)] bg-color-bg-1 bg-no-repeat bg-contain bg-right   ">
                    <div className="space-y-4">
                      <div className="text-color-text-1 space-y-1">
                        <p className="text-[26px] capitalize max-2xl:text-2xl  text-white">Women’s Collections</p>
                        <p className="text-base max-2xl:text-sm text-white">Featured woman collections that give you another vibe.</p>
                      </div>
                      <button className="flex items-center gap-4 text-color-text-1 bg-transparent text-white">
                        <p className="underline capitalize underline-offset-[10px] text-lg max-2xl:text-base">shop now</p>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="w-6 h-6 opacity-0 -translate-x-4 duration-300 ease-in-out transition-all group-hover:translate-x-0 group-hover:opacity-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative h-[185px] bg-black rounded-lg overflow-hidden text-white ">
                  <div className="flex items-end p-4 rounded-sm bg-color-bg-1 relative">
                    <Image alt="banner" loading="lazy" width="300" height="300" decoding="async"
                      src={'/assets/images/speaker.png'} className="h-52 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] max-2xl:h-40" />
                    <div className="space-y-4 absolute bottom-0 left-0 p-4 lg:p-10">
                      <div className="text-color-text-1 space-y-1">
                        <p className="text-[26px] capitalize max-2xl:text-2xl __className_153980">Speakers</p>
                        <p className="text-base max-2xl:text-sm">Amazon wireless speakers</p></div>
                      <button className="flex items-center gap-4 text-color-text-1 bg-transparent group __className_6dd009">
                        <p className="underline capitalize underline-offset-[10px] text-lg max-2xl:text-base">shop now</p>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="w-6 h-6 opacity-0 -translate-x-4 duration-300 ease-in-out transition-all group-hover:translate-x-0 group-hover:opacity-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative h-[185px] bg-black rounded-lg overflow-hidden text-white">
                  <div className="flex items-end p-4 rounded-sm bg-color-bg-1 relative">
                    <Image alt="banner" loading="lazy" width="300" height="300" decoding="async"
                      src={'/assets/images/gucci-perfume.png'} className="h-52 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] max-2xl:h-40" />
                    <div className="space-y-4 absolute bottom-0 left-0 p-4 lg:p-10">
                      <div className="text-color-text-1 space-y-1">
                        <p className="text-[26px] capitalize max-2xl:text-2xl __className_153980">Perfume</p>
                        <p className="text-base max-2xl:text-sm">GUCCI INTENSE OUD EDP</p></div>
                      <button className="flex items-center gap-4 text-color-text-1 bg-transparent group __className_6dd009">
                        <p className="underline capitalize underline-offset-[10px] text-lg max-2xl:text-base">shop now</p>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="w-6 h-6 opacity-0 -translate-x-4 duration-300 ease-in-out transition-all group-hover:translate-x-0 group-hover:opacity-100" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">FREE AND FAST DELIVERY</h3>
                <p className="text-sm text-muted-foreground">Free delivery for all orders over $140</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <HeadphonesIcon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">24/7 CUSTOMER SERVICE</h3>
                <p className="text-sm text-muted-foreground">Friendly 24/7 customer support</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">MONEY BACK GUARANTEE</h3>
                <p className="text-sm text-muted-foreground">We return money within 30 days</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

