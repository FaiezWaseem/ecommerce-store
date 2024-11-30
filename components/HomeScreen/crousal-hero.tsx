import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function CarouselHero() {
    return (
        <Carousel
            className="w-full relative"

        >
            <CarouselContent>
                <CarouselItem >
                    <div className="relative h-[300px] md:h-[400px] w-full bg-black rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-between p-6 md:p-12">
                            <div className="text-white space-y-4">
                                <Image src="/assets/images/1200px-Apple_gray_logo 1.png" alt="Apple Logo" width={40} height={40} />
                                <h2 className="text-2xl md:text-4xl font-bold">iPhone 14 Series</h2>
                                <p className="text-xl md:text-3xl">Up to 10% off Voucher</p>
                                <Button variant="link" className="text-white p-0">
                                    Shop Now →
                                </Button>
                            </div>
                            <Image
                                src="/assets/images/hero_iphone.png"
                                alt="iPhone 14"
                                width={400}
                                height={400}
                                className="hidden md:block"
                            />
                        </div>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="relative h-[300px] md:h-[400px] w-full bg-black rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-between p-6 md:p-12">
                            <div className="text-white space-y-4">
                                <Image src="/assets/images/1200px-Apple_gray_logo 1.png" alt="Apple Logo" width={40} height={40} />
                                <h2 className="text-2xl md:text-4xl font-bold">iPhone 14 Series</h2>
                                <p className="text-xl md:text-3xl">Up to 10% off Voucher</p>
                                <Button variant="link" className="text-white p-0">
                                    Shop Now →
                                </Button>
                            </div>
                            <Image
                                src="/assets/images/hero_iphone.png"
                                alt="iPhone 14"
                                width={400}
                                height={400}
                                className="hidden md:block"
                            />
                        </div>
                    </div>
                </CarouselItem>
            </CarouselContent>

            <CarouselPrevious className="left-[10px]" />
            <CarouselNext className="right-[10px]" />



        </Carousel>
    )
}

