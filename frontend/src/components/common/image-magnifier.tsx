import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ImageMagnifierProps {
  src: string | null;
  imageAlt?: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoom?: number;
}

export default function ImageMagnifier({
  src,
  magnifierHeight = 100,
  magnifierWidth = 100,
  zoom = 2,
  imageAlt = "magnifier",
}: ImageMagnifierProps) {
  const [magnifierPosition, setMagnifierPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImageSize({ width, height });
    }
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const { top, left } = imgRef.current!.getBoundingClientRect();

    let x = e.clientX - left;
    let y = e.clientY - top;
    // Max: bottom limit
    // Min: top limit
    x = Math.max(
      magnifierWidth / 2,
      Math.min(imageSize.width - magnifierWidth / 2, x)
    );
    y = Math.max(
      magnifierHeight / 2,
      Math.min(imageSize.height - magnifierHeight / 2, y)
    );

    setMagnifierPosition({
      top: y - magnifierHeight / 2,
      left: x - magnifierWidth / 2,
    });
  };

  return (
    <HoverCard openDelay={0} closeDelay={20}>
      <HoverCardTrigger>
        <div className="relative h-64">
          {src && (
            <Image
              ref={imgRef}
              src={src}
              alt={imageAlt}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowMagnifier(true)}
              onMouseLeave={() => setShowMagnifier(false)}
            />
          )}
          {showMagnifier && (
            <div
              className="absolute pointer-events-none border border-gray-300 bg-white/20 backdrop-blur-xs rounded"
              style={{
                top: magnifierPosition.top,
                left: magnifierPosition.left,
                width: magnifierWidth,
                height: magnifierHeight,
              }}
            />
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent align="center" side="right" className="w-fit">
        <div
          style={{
            width: magnifierWidth * zoom,
            height: magnifierHeight * zoom,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imageSize.width * zoom}px ${
              imageSize.height * zoom
            }px`,
            backgroundPosition: `-${magnifierPosition.left * zoom}px -${
              magnifierPosition.top * zoom
            }px`,
            border: "1px solid #ccc",
          }}
          className="pointer-events-none"
        />
      </HoverCardContent>
    </HoverCard>
  );
}
