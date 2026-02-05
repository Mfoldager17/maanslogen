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
    <ul
      className={[
        "overflow-hidden border border-border rounded-lg shadow-sm bg-background-elevated",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </ul>
  );
}
