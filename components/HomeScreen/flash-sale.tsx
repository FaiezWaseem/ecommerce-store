import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Heart } from 'lucide-react'
import Image from "next/image"



export default function FlashSale() {

    const products = [
        {
            title: 'G92 GamePad',
            image: '/assets/images/G92_GamePad.png',
            sale_price: '120',
            price: '150',
        },
        {
            title: 'Gucci Bag.png',
            image: '/assets/images/gucci-bag.png',
            sale_price: '340',
            price: '480',
        },
        {
            title: 'LCD Gamming Monitor',
            image: '/assets/images/lcd_gamming_monitor.png',
            sale_price: '299',
            price: '400',
        },
        {
            title: 'Bricks ~ Chair',
            image: '/assets/images/chair.png',
            sale_price: '89',
            price: '100',
        },
        {
            title: 'G92 GamePad',
            image: '/assets/images/G92_GamePad.png',
            sale_price: '120',
            price: '150',
        },
        {
            title: 'Gucci Bag.png',
            image: '/assets/images/gucci-bag.png',
            sale_price: '340',
            price: '480',
        },
        {
            title: 'LCD Gamming Monitor',
            image: '/assets/images/lcd_gamming_monitor.png',
            sale_price: '299',
            price: '400',
        },
    ]

    return <section className="mt-6">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-semibold mb-1 text-app_red">Today's</h3>
                <h2 className="text-2xl font-bold">Flash Sales</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="grid grid-cols-4 gap-1 text-center">
                    <div>
                        <div className="text-2xl font-bold text-app_red">03</div>
                        <div className="text-sm text-muted-foreground">Days</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-app_red">23</div>
                        <div className="text-sm text-muted-foreground">Hours</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-app_red">19</div>
                        <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-app_red">56</div>
                        <div className="text-sm text-muted-foreground">Seconds</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="relative">
            <ScrollArea>
                <div className="flex space-x-4 pb-4">
                    {products.map((item, index) => (
                        <Card key={index} className="w-[200px] flex-none">
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
                                    <h3 className="font-semibold truncate">{item.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-primary font-bold">${item.sale_price}</span>
                                        <span className="text-sm text-muted-foreground line-through">${item.price}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    </section>
}