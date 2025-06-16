import Link from "next/link";
import React from "react";

interface SlugLinkProps {
  title: string;
  slug: string;
  prefix: string;
  className?: string;
}

export default function SlugLink({
  title,
  slug,
  prefix,
  className,
}: SlugLinkProps) {
  return (
    <Link href={prefix + "/" + slug} className={className}>
      {title}
    </Link>
  );
}
