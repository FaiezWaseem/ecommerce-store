"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart } from 'lucide-react';
import Image from "next/image";

export default function FlashSale() {
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 23,
        minutes: 59,
        seconds: 59,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                const totalSeconds =
                    prevTime.days * 86400 +
                    prevTime.hours * 3600 +
                    prevTime.minutes * 60 +
                    prevTime.seconds - 1;

                if (totalSeconds <= 0) {
                    clearInterval(timer);
                    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
                }

                const days = Math.floor(totalSeconds / 86400);
                const hours = Math.floor((totalSeconds % 86400) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const products = [
        {
            title: 'G92 GamePad',
            image: '/assets/images/G92_GamePad.png',
            sale_price: '120',
            price: '150',
        },
        {
            title: 'Gucci Bag',
            image: '/assets/images/gucci-bag.png',
            sale_price: '340',
            price: '480',
        },
        {
            title: 'LCD Gaming Monitor',
            image: '/assets/images/lcd_gamming_monitor.png',
            sale_price: '299',
            price: '400',
        },
        {
            title: 'Bricks Chair',
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
            title: 'Gucci Bag',
            image: '/assets/images/gucci-bag.png',
            sale_price: '340',
            price: '480',
        },
    ];

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-1">{"Today's"}</h3>
                    <h2 className="text-xl lg:text-2xl font-bold text-app_red">Flash Sales</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="grid grid-cols-4 gap-1 text-center">
                        <div>
                            <div className="text-xl lg:text-2xl font-bold text-app_red">{timeLeft.days}</div>
                            <div className="text-sm text-muted-foreground">Days</div>
                        </div>
                        <div>
                            <div className="text-xl lg:text-2xl font-bold text-app_red">{timeLeft.hours}</div>
                            <div className="text-sm text-muted-foreground">Hours</div>
                        </div>
                        <div>
                            <div className="text-xl lg:text-2xl font-bold text-app_red">{timeLeft.minutes}</div>
                            <div className="text-sm text-muted-foreground">Minutes</div>
                        </div>
                        <div>
                            <div className="text-xl lg:text-2xl font-bold text-app_red">{timeLeft.seconds}</div>
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
                                            alt={item.title}
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
    );
}
