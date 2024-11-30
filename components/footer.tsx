import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Apple, Facebook, Instagram, Linkedin, QrCode, Twitter } from 'lucide-react'
import { Play } from 'lucide-react'



export default function Footer(){

    return(
        <footer className="bg-black text-white">
        <div className="container px-4 py-12 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-4 overflow-x-hidden">
              <h2 className="text-xl font-bold">Exclusive</h2>
              <p>Subscribe</p>
              <p className="text-sm">Get 10% off your first order</p>
              <div className="flex flex-1">
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
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Support</h2>
              <ul className="space-y-2 text-sm">
                <li>2079 County Road D E.</li>
                <li>eshop@gmail.com</li>
                <li>+88015-88888-9999</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Account</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account">My Account</Link></li>
                <li><Link href="/login">Login / Register</Link></li>
                <li><Link href="/cart">Cart</Link></li>
                <li><Link href="#">Wishlist</Link></li>
                <li><Link href="/search">Shop</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Quick Link</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="#">Terms Of Use</Link></li>
                <li><Link href="#">FAQ</Link></li>
                <li><Link href="#">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Download App</h2>
              <p className="text-sm">Save $3 with App New User Only</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-900 p-2 rounded">
                  <QrCode className="h-20 w-20" />
                </div>
                <div className="space-y-2">
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
              <div className="flex space-x-4">
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
    )
}