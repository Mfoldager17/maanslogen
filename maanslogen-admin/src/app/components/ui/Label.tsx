import type { ReactNode } from "react";

export function Label({
  children,
  htmlFor,
  className = "",
  ...rest
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-foreground-muted mb-1 block text-sm font-medium ${className}`.trim()}
      {...rest}
    >
      {children}
    </label>
  );
}
