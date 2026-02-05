"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function LinkButton({
  href,
  children,
  className = "",
  variant = "secondary",
  iconOnly,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "accent" | "secondary";
  iconOnly?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const base =
    "inline-flex items-center justify-center rounded-theme font-medium transition-colors focus:ring-2 focus:ring-[rgb(var(--color-accent))]";
  const size = iconOnly ? "min-h-[44px] min-w-[44px] p-2" : "min-h-[44px] px-4";
  const variants =
    variant === "accent" ? "btn-accent" : "btn-secondary";
  return (
    <Link
      href={href}
      className={`${base} ${size} ${variants} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  );
}
