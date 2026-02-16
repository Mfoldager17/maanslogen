import type { ReactNode } from "react";

export function SectionHeading({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-foreground mb-4 text-lg font-medium ${className}`.trim()}
      {...rest}
    >
      {children}
    </h2>
  );
}
