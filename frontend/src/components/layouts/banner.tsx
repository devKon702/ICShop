"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const bannerImage = ["banner-1.jpg", "banner-2.jpg", "banner-3.jpg"];

export default function Banner() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!api) {
      return;
    }
    setTotal(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const timer = setInterval(() => {
      if (!hover) {
        api?.scrollTo((current + 1) % total);
      }
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [api, current, total, hover]);

  return (
    <div
      className="w-full mx-auto relative rounded-md overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Carousel className="w-full h-full" setApi={setApi}>
        <CarouselContent className="max-h-72 cursor-pointer">
          {bannerImage.map((item, index) => (
            <CarouselItem key={index}>
              <Image
                src={`/uploads/${item}`}
                alt="banner"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              ></Image>
            </CarouselItem>
          ))}
        </CarouselContent>
        <ul className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              className={`rounded-full size-5 border-2 cursor-pointer ${
                current === index ? "bg-primary" : "bg-white"
              }`}
              onClick={() => {
                api?.scrollTo(index);
              }}
            ></div>
          ))}
        </ul>
      </Carousel>
    </div>
  );
}
