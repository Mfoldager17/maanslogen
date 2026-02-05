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
    <select className={`input-theme ${className}`.trim()} {...rest}>
      {children}
    </select>
  );
}
