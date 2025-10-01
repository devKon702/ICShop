"use client";
import ImageMagnifier from "@/components/common/image-magnifier";
import SafeImage from "@/components/common/safe-image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import env from "@/constants/env";
import React from "react";

interface ProductMediaGalleryProps {
  imageUrls: string[];
}

export default function ProductMediaGallery({
  imageUrls,
}: ProductMediaGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [mainImage, setMainImage] = React.useState<string>(imageUrls[0]);

  React.useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  React.useEffect(() => {
    setMainImage(imageUrls[selectedIndex]);
  }, [selectedIndex, imageUrls]);

  return (
    <div className="col-span-4 p-2 rounded-md bg-white">
      <ImageMagnifier
        src={`${env.NEXT_PUBLIC_FILE_URL}/${mainImage}`}
        imageAlt="IC"
        zoom={2}
      ></ImageMagnifier>
      <Carousel className="mt-3" setApi={setApi}>
        <CarouselContent className="">
          {imageUrls.map((item, index) => (
            <CarouselItem key={index} className="basis-1/4 cursor-pointer">
              <SafeImage
                src={`${env.NEXT_PUBLIC_FILE_URL}/${item}`}
                alt="Image"
                width={200}
                height={200}
                className="w-full object-cover shadow border"
                onClick={() => {
                  setSelectedIndex(index);
                }}
              ></SafeImage>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
