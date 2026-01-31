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
          ? `flex min-h-10 min-w-10 touch-manipulation flex-shrink-0 items-center justify-center rounded-theme text-[rgb(var(--color-fg))] transition-colors hover:bg-[rgb(var(--color-bg-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] ${
              isActive ? "bg-[rgb(var(--color-bg-hover))]" : ""
            }`
          : `flex min-h-[44px] touch-manipulation items-center gap-3 rounded-theme px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "nav-active" : "nav-inactive"
            }`
      }
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      {!iconOnly && label}
    </Link>
  );
}
