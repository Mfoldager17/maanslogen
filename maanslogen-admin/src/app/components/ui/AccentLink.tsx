import Link from "next/link";
import type { ReactNode } from "react";

export function AccentLink({
  href,
  children,
  className = "",
  small,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  small?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const size = small ? "text-sm" : "";
  return (
    <Link
      href={href}
      className={`font-medium text-[rgb(var(--color-accent))] hover:underline ${size} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  );
}
