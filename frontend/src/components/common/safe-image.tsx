"use client";
import env from "@/constants/env";
import Image from "next/image";
import React, { ImgHTMLAttributes, useState } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src?: string;
  alt?: string;
  ref?: React.Ref<HTMLImageElement>;
  avatarPlaceholderName?: string;
  appFileBase?: boolean;
}

const SafeImage = ({
  width,
  height,
  src,
  alt,
  ref,
  avatarPlaceholderName,
  appFileBase,
  ...props
}: Props) => {
  const [safeSrc, setSafeSrc] = useState(() => {
    if (!src) {
      return avatarPlaceholderName
        ? `https://ui-avatars.com/api/?name=${avatarPlaceholderName}&format=png`
        : `https://placehold.co/${width}x${height}.jpg`;
    }
    if (appFileBase) {
      return new URL(src, env.NEXT_PUBLIC_FILE_URL + "/").href;
    }
    return src;
  });
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
