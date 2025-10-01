"use client";
import Image from "next/image";
import React, { ImgHTMLAttributes, useState } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src: string;
  alt?: string;
  ref?: React.Ref<HTMLImageElement>;
}

const SafeImage = ({ width, height, src = "", alt, ref, ...props }: Props) => {
  const [safeSrc, setSafeSrc] = useState(src);
  return (
    <Image
      width={width}
      height={height}
      alt={alt ? alt : "Ảnh"}
      ref={ref}
      src={safeSrc}
      onError={() => setSafeSrc(`https://placehold.co/${width}x${height}.jpg`)}
      {...props}
    />
  );
};

export default SafeImage;
