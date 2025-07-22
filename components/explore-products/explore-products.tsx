import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

interface ExploreProductsProps {
  products: Product[]
}

export default function ExploreProducts({ products }: ExploreProductsProps) {
  const displayProducts = products.slice(0, 8)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Our Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of high-quality products designed to meet your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProducts.map((product, index) => (
            <Link href={`/product/${product.id || index}`} key={product.id || index}>
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src={product.images?.[0]?.url || product.image! || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="outline" className="bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button size="sm" variant="outline" className="bg-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-500 font-bold">
                      ${product.salePrice || product.regularPrice}
                    </span>
                    {product.salePrice && product.regularPrice !== product.salePrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ${product.regularPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400">
                      </Star>
                    ))}
                    <span className="text-gray-500 text-sm ml-1">(88)</span>
                  </div>
                  <Button className="w-full">
                    Add To Cart
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}