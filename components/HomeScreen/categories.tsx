import { CameraIcon, ComputerIcon, Gamepad2Icon, HeadphonesIcon, Phone, WatchIcon } from "lucide-react";
import { Button } from "../ui/button";



export default function Categories(){

    const categories = [
        {
            name: 'Phones',
            icon: <Phone />,
        },
        {
            name: 'Computers',
            icon: <ComputerIcon />,
        },
        {
            name: 'SmartWatch',
            icon: <WatchIcon />,
        },
        {
            name: 'Camera',
            icon: <CameraIcon />,
        },
        {
            name: 'HeadPhones',
            icon: <HeadphonesIcon />,
        },
        {
            name: 'Gaming',
            icon: <Gamepad2Icon />,
        },
    ]

    return  <section>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold mb-1 text-app_red">Categories</h3>
        <h2 className="text-2xl font-bold">Browse By Category</h2>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Button
          key={category.name}
          variant="outline"
          className="h-22 flex-col gap-2 hover:bg-app_red hover:text-white"
        >
          <div className="w-6 h-6" />
          {category.icon}
          {category.name}
          <div className="w-6 h-6" />
        </Button>
      ))}
    </div>
  </section>
}