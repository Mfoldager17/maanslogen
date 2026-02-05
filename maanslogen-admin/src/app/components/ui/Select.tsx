import type { ReactNode } from "react";

export function Select({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`input-theme w-full min-w-0 ${className}`.trim()} {...rest}>
      {children}
    </select>
  );
}
