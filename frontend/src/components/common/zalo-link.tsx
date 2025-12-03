import React from "react";

import Link from "next/link";
import { getZaloLinkFromPhone } from "@/utils/string";
interface ZaloLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  phone: string;
  children?: React.ReactNode;
}

export default function ZaloLink({ phone, children, ...props }: ZaloLinkProps) {
  return (
    <Link
      href={getZaloLinkFromPhone(phone) ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </Link>
  );
}
