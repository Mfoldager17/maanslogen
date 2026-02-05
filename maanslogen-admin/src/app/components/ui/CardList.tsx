import type { ReactNode } from "react";

export function CardList({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`card overflow-hidden ${className}`.trim()} {...rest}>
      {children}
    </ul>
  );
}
