import type { ReactNode } from "react";

export function PageHeading({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={`text-heading mb-6 text-2xl font-semibold ${className}`.trim()}
      {...rest}
    >
      {children}
    </h1>
  );
}
