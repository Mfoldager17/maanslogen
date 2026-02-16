"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  label,
  icon: Icon,
  iconOnly,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconOnly?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      title={iconOnly ? label : undefined}
      aria-label={iconOnly ? label : undefined}
      className={
        iconOnly
          ? `flex min-h-10 min-w-10 touch-manipulation flex-shrink-0 items-center justify-center rounded text-foreground transition-colors hover:bg-background-hover focus:ring-2 focus:ring-accent ${
              isActive ? "bg-background-hover" : ""
            }`
          : `flex min-h-[44px] touch-manipulation items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent/15 text-accent"
                : "text-foreground-muted hover:bg-background-hover hover:text-foreground"
            }`
      }
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      {!iconOnly && label}
    </Link>
  );
}
