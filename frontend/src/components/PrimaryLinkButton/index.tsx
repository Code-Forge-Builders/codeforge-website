import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

type PrimaryLinkButtonProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export default function PrimaryLinkButton({ className, children, ...props }: PrimaryLinkButtonProps) {
  return <Link className={`bg-primary px-4 py-2 rounded ${className}`} {...props} >{children}</Link>
}
