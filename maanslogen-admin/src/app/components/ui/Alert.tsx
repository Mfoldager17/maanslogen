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
  const variantClass =
    variant === "error"
      ? "rounded p-4 text-sm bg-red-500/10 text-red-800 [[data-theme=dark]_&]:bg-red-500/20 [[data-theme=dark]_&]:text-red-200"
      : "";
  return (
    <div className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
