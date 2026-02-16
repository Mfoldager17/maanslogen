import type { ReactNode } from "react";

export function EmptyState({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-foreground-muted ${className}`.trim()} {...rest}>
      {children}
    </p>
  );
}
