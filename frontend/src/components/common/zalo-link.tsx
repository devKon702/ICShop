import React from "react";

import Link from "next/link";
import { getZaloLinkFromPhone } from "@/utils/string";
interface ZaloLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  phone: string;
  children?: React.ReactNode;
}

export default function ZaloLink({ phone, ...props }: ZaloLinkProps) {
  return (
    <Link href={getZaloLinkFromPhone(phone) ?? "#"} {...props}>
      {props.children}
    </Link>
  );
}
