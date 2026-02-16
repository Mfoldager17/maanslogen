import type { ReactNode } from "react";

export function CardListItem({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={[
        "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 last:border-b-0 transition-colors duration-150",
        "hover:bg-background-hover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </li>
  );
}
