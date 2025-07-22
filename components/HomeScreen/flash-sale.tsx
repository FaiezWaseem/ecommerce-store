"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface FlashSaleProduct {
    id: string;
    productId: string;
    isActive: boolean;
    sortOrder: number;
    product: {
        id: string;
        slug: string,
        name: string;
        regularPrice: number;
        salePrice: number | null;
        images: {
            url: string;
        }[];
    };
}

export default function FlashSale() {
    const [flashSaleProducts, setFlashSaleProducts] = useState<FlashSaleProduct[]>([]);
    const [settings, setSettings] = useState<{ flashSaleEnabled: boolean; flashSaleEndTime: string | null }>({
        flashSaleEnabled: true,
        flashSaleEndTime: null
    });
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fetch flash sale products and settings
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings
                const settingsResponse = await fetch('/api/home-settings');
                if (settingsResponse.ok) {
                    const settingsData = await settingsResponse.json();
                    setSettings({
                        flashSaleEnabled: settingsData.flashSaleEnabled,
                        flashSaleEndTime: settingsData.flashSaleEndTime
                    });
                }

                // Fetch flash sale products
                const productsResponse = await fetch('/api/home-settings/flash-sale');
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setFlashSaleProducts(productsData.filter((product: FlashSaleProduct) => product.isActive));
                }
            } catch (error) {
                console.error('Error fetching flash sale data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate time left based on flashSaleEndTime
    useEffect(() => {
        if (!settings.flashSaleEndTime) {
            // Default to 3 days if no end time is set
            setTimeLeft({
                days: 3,
                hours: 23,
                minutes: 59,
                seconds: 59,
            });
            return;
        }

        const calculateTimeLeft = () => {
            const endTime = new Date(settings.flashSaleEndTime as string).getTime();
            const now = new Date().getTime();
            const difference = endTime - now;

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [settings.flashSaleEndTime]);


    // Don't render if flash sale is disabled or there are no products
    if (!settings.flashSaleEnabled || (flashSaleProducts.length === 0 && !loading)) {
        return null;
    }

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
                        {loading ? (
                            // Loading skeleton
                            Array(4).fill(0).map((_, index) => (
                                <Card key={index} className="w-[200px] flex-none">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-square bg-gray-200 animate-pulse"></div>
                                        <div className="p-4">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            // Actual products
                            flashSaleProducts.map((item) => (
                                <Card key={item.id} className="w-[200px] flex-none">
                                    <CardContent className="p-0">
                                        <Link href={`/product/${item.product.slug}`}>
                                            <div className="relative aspect-square">
                                                {item.product.images && item.product.images[0] ? (
                                                    <Image
                                                        src={item.product.images[0].url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover rounded-t-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold truncate">{item.product.name}</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-primary font-bold">
                                                        Rs {Number(item.product.salePrice) === 0 ? item.product.regularPrice : (item.product.salePrice || item.product.regularPrice)}
                                                    </span>
                                                    {item.product.salePrice && Number(item.product.salePrice) !== 0 && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            Rs {item.product.regularPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
}
