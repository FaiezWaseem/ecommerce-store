import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Apple, Facebook, Instagram, Linkedin, QrCode, Twitter, Home, ShoppingCart, User, Heart as WishList, Search } from 'lucide-react'
import { Play } from 'lucide-react'

function MobileTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white flex justify-around items-center h-14 border-t border-gray-800 md:hidden">
      <Link href="/" className="flex flex-col items-center justify-center text-xs">
        <Home className="h-5 w-5" />
        Home
      </Link>
      <Link href="/search" className="flex flex-col items-center justify-center text-xs">
        <Search className="h-5 w-5" />
        Search
      </Link>
      <Link href="/cart" className="flex flex-col items-center justify-center text-xs">
        <ShoppingCart className="h-5 w-5" />
        Cart
      </Link>
      <Link href="#" className="flex flex-col items-center justify-center text-xs">
        <WishList className="h-5 w-5" />
        Wishlist
      </Link>
      <Link href="/account" className="flex flex-col items-center justify-center text-xs">
        <User className="h-5 w-5" />
        Account
      </Link>
    </nav>
  );
}

export default function Footer(){
  return (
    <>
      {/* Desktop/Tablet Footer */}
      <footer className="bg-black text-white hidden md:block">
        <div className="container px-4 py-12 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center text-center md:justify-items-start md:text-left">
            <div className="space-y-4 overflow-x-hidden w-full max-w-xs">
              <h2 className="text-xl font-bold">Exclusive</h2>
              <p>Subscribe</p>
              <p className="text-sm">Get 10% off your first order</p>
              <div className="flex flex-1 justify-center md:justify-start">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 w-32 py-2 bg-transparent border rounded-l text-sm"
                />
                <Button variant="secondary" className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
            <div className="space-y-4 w-full max-w-xs">
              <h2 className="text-xl font-bold">Support</h2>
              <ul className="space-y-2 text-sm">
                <li>2079 County Road D E.</li>
                <li>eshop@gmail.com</li>
                <li>+88015-88888-9999</li>
              </ul>
            </div>
            <div className="space-y-4 w-full max-w-xs">
              <h2 className="text-xl font-bold">Account</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account">My Account</Link></li>
                <li><Link href="/login">Login / Register</Link></li>
                <li><Link href="/cart">Cart</Link></li>
                <li><Link href="#">Wishlist</Link></li>
                <li><Link href="/search">Shop</Link></li>
              </ul>
            </div>
            <div className="space-y-4 w-full max-w-xs">
              <h2 className="text-xl font-bold">Quick Link</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="#">Terms Of Use</Link></li>
                <li><Link href="#">FAQ</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4 w-full max-w-xs">
              <h2 className="text-xl font-bold">Download App</h2>
              <p className="text-sm">Save $3 with App New User Only</p>
              <div className="grid grid-cols-2 gap-2 justify-center">
                <div className="bg-gray-900 p-2 rounded flex justify-center">
                  <QrCode className="h-20 w-20" />
                </div>
                <div className="space-y-2 flex flex-col items-center w-full">
                  <Button variant="outline" className="w-full text-black">
                    <Apple className="h-4 w-4 mr-2" />
                    App Store
                  </Button>
                  <Button variant="outline" className="w-full text-black">
                    <Play className="h-4 w-4 mr-2" />
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="flex space-x-4 justify-center">
                <Link href="#"><Facebook className="h-5 w-5" /></Link>
                <Link href="#"><Twitter className="h-5 w-5" /></Link>
                <Link href="#"><Instagram className="h-5 w-5" /></Link>
                <Link href="#"><Linkedin className="h-5 w-5" /></Link>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-sm text-gray-400">
            © Copyright E-shop {new Date().getFullYear()}. All right reserved
          </div>
        </div>
      </footer>
      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </>
  )
}