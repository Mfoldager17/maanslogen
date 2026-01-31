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
      className={`card-list-item flex items-center justify-between px-4 py-3 ${className}`.trim()}
      {...rest}
    >
      {children}
    </li>
  );
}
