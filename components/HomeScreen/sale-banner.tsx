'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface SaleBannerProps {
  id: string;
  title: string;
  description?: string;
  discount?: string;
  image?: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface SaleBannersProps {
  saleBanners: SaleBannerProps[];
}

const SaleBanner = ({ saleBanners }: SaleBannersProps) => {
  const [activeBanners, setActiveBanners] = useState<SaleBannerProps[]>([]);

  useEffect(() => {
    // Filter active banners based on current date and isActive flag
    const now = new Date();
    const filtered = saleBanners.filter(banner => {
      const isDateValid = (!banner.startDate || new Date(banner.startDate) <= now) && 
                          (!banner.endDate || new Date(banner.endDate) >= now);
      return banner.isActive && isDateValid;
    });
    
    setActiveBanners(filtered);
  }, [saleBanners]);

  if (activeBanners.length === 0) return null;

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeBanners.map((banner) => (
          <div 
            key={banner.id}
            className="relative rounded-lg overflow-hidden p-6 flex flex-col justify-center"
            style={{ 
              backgroundColor: banner.bgColor || '#ff0000',
              color: banner.textColor || '#ffffff',
              minHeight: '180px'
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="space-y-3 z-10 mb-4 md:mb-0">
                {banner.discount && (
                  <span className="inline-block px-3 py-1 bg-white text-black rounded-full text-sm font-semibold">
                    {banner.discount}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold">{banner.title}</h3>
                {banner.description && (
                  <p className="text-sm md:text-base">{banner.description}</p>
                )}
                {banner.buttonText && banner.buttonLink && (
                  <Link href={banner.buttonLink}>
                    <Button 
                      className="mt-2" 
                      style={{ 
                        backgroundColor: 'white', 
                        color: banner.bgColor || '#ff0000' 
                      }}
                    >
                      {banner.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
              {banner.image && (
                <div className="relative h-32 w-32 md:h-40 md:w-40 z-10">
                  <Image 
                    src={banner.image} 
                    alt={banner.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SaleBanner;