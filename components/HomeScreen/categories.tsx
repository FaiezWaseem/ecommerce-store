import { CameraIcon, ComputerIcon, Gamepad2Icon, HeadphonesIcon, Phone, WatchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Category } from "@/types/product";
import Image from "next/image";
import Link from "next/link";



export default function Categories(props: { categories: Category[] }) {

  const { categories } = props

  // Limit to maximum 6 categories
  const displayCategories = categories.slice(0, 6)

  return <section>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold mb-1 ">Categories</h3>
        <h2 className="text-2xl font-bold text-app_red">Browse By Category</h2>
      </div>
      {categories.length > 6 && (
        <Link href="/categories">
          <Button
            variant="outline"
            className="text-app_red border-app_red hover:bg-app_red hover:text-white"
          >
            View All
          </Button>
        </Link>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {displayCategories.map((category) => (
        <Button
            key={category.name}
            variant="outline"
            className="h-36 relative overflow-hidden p-0 hover:border-app_red"
          >
        <Link href={`/category/${category.slug}`}>
            {category.image ? (
              <>
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-2">
                  <span className="text-white font-medium">{category.name}</span>
                </div>
              </>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-2">
                <div className="w-6 h-6" />
                {category.name}
                <div className="w-6 h-6" />
              </div>
            )}
            </Link>
          </Button>
      ))}
    </div>
  </section>
}