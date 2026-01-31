import type { ReactNode } from "react";

export function Alert({
  children,
  variant = "error",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: "error";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const variantClass = variant === "error" ? "alert-error" : "";
  return (
    <div className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
