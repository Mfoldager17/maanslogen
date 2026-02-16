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
    "inline-flex items-center justify-center rounded font-medium transition-colors focus:ring-2 focus:ring-accent no-underline";
  const size = iconOnly ? "min-h-[44px] min-w-[44px] p-2" : "min-h-[44px] px-4";
  const variants =
    variant === "accent"
      ? "bg-accent text-accent-foreground border-none shadow-[0_2px_8px_rgb(var(--color-accent)/0.35)] hover:bg-accent-hover"
      : "bg-accent/25 text-accent border-none hover:bg-accent/40 hover:text-accent-hover";
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
