import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"

interface CarouselHeroProps {
    carouselBanners: Array<{
        id: string
        title: string
        subtitle: string
        description: any
        buttonText: string
        buttonLink: string
        image: string
        logoImage: any
        bgColor: string
        textColor: string
        isActive: boolean
        sortOrder: number
        position: string
        createdAt: string
        updatedAt: string
    }>
}

export default function CarouselHero(props: CarouselHeroProps) {
    const { carouselBanners } = props
    return (
        <Carousel
            className="w-full relative"
        >
            <CarouselContent>
                {carouselBanners.map(banner => {

                    if(!banner.isActive) {
                        return null
                    }

                    return (
                        <CarouselItem key={banner.id}>
                            <div style={{backgroundColor: banner.bgColor}} className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-between p-6 md:p-12">
                                    <div style={{color: banner.textColor}} className="space-y-4">
                                        {/* <Image src="/assets/images/1200px-Apple_gray_logo 1.png" alt="Apple Logo" width={40} height={40} /> */}
                                        <h2 className="text-2xl md:text-4xl font-bold">{banner.title}</h2>
                                        <p className="text-xl md:text-3xl">{banner.subtitle}</p>
                                        <Link href={banner.buttonLink} className="p-0 underline mt-5">
                                            {banner.buttonText}
                                        </Link>
                                    </div>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title}
                                        width={400}
                                        height={400}
                                        className="hidden md:block"
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    )
                }
                )}


            </CarouselContent>

            <CarouselPrevious className="left-[10px]" />
            <CarouselNext className="right-[10px]" />



        </Carousel>
    )
}

