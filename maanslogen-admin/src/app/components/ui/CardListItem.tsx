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
      className={`card-list-item flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
      {...rest}
    >
      {children}
    </li>
  );
}
