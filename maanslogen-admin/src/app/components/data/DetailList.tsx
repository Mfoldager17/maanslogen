import type { ReactNode } from "react";

export function DetailList({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl className={`space-y-3 ${className}`.trim()} {...rest}>
      {children}
    </dl>
  );
}
