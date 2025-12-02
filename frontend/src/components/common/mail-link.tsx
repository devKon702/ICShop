import React from "react";

import Link from "next/link";
import { getMailLinkFromEmail } from "@/utils/string";

interface MailLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  email: string;
  children?: React.ReactNode;
}

export default function MailLink({ email, children, ...props }: MailLinkProps) {
  return (
    <Link href={getMailLinkFromEmail(email) ?? "#"} {...props}>
      {children}
    </Link>
  );
}
