"use client";
import SafeImage from "@/components/common/safe-image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
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
  // Get image file
  const { data: imageUrl } = useQuery({
    queryKey: ["image-file", src],
    queryFn: async () => {
      if (!src) {
        return null;
      }
      const response = await fetch(src);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
  });

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

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    let lensX = mouseX - magnifierWidth / 2;
    let lensY = mouseY - magnifierHeight / 2;

    // Max: bottom limit
    // Min: top limit
    lensX = Math.max(0, Math.min(imageSize.width - magnifierWidth, lensX));
    lensY = Math.max(0, Math.min(imageSize.height - magnifierHeight, lensY));

    setMagnifierPosition({
      top: lensY,
      left: lensX,
    });
  };

  return (
    <HoverCard openDelay={0} closeDelay={20}>
      <HoverCardTrigger>
        <div className="relative aspect-square w-full">
          {src && (
            <SafeImage
              key={src}
              ref={imgRef}
              src={src}
              alt={imageAlt}
              width={400}
              height={400}
              className="object-cover w-full h-full shadow border cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowMagnifier(true)}
              onMouseLeave={() => setShowMagnifier(false)}
              onClick={() => {
                if (src) window.open(src, "_blank", "noopener,noreferrer");
              }}
            />
          )}
          {showMagnifier && (
            <div
              className="absolute border pointer-events-none cursor-zoom-out border-gray-300 bg-white/20 backdrop-blur-xs rounded"
              style={{
                top: magnifierPosition.top + "px",
                left: magnifierPosition.left + "px",
                width: magnifierWidth + "px",
                height: magnifierHeight + "px",
              }}
            />
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        side="right"
        className="p-0 m-0 size-fit"
      >
        {src && (
          <div
            style={{
              width: magnifierWidth * zoom,
              height: magnifierHeight * zoom,
              position: "relative",
              border: "1px solid #ccc",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                // left: -magnifierPosition.left * zoom,
                // top: -magnifierPosition.top * zoom,
                width: imageSize.width * zoom,
                height: imageSize.height * zoom,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${imageSize.width * zoom}px ${
                  imageSize.height * zoom
                }px`,
                backgroundPosition: `${-magnifierPosition.left * zoom}px ${
                  -magnifierPosition.top * zoom
                }px`,
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                userSelect: "none",
                aspectRatio: "1/1",
              }}
            />
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
