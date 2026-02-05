import type { ReactNode } from "react";

export function Button({
  children,
  type = "button",
  disabled,
  className = "",
  variant = "accent",
  iconOnly,
  ...rest
}: {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "accent" | "outline" | "danger" | "ghost";
  iconOnly?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "inline-flex items-center justify-center rounded-theme font-medium transition-colors focus:ring-2 focus:ring-[rgb(var(--color-accent))] disabled:opacity-50 disabled:cursor-not-allowed";
  const size = iconOnly ? "min-h-[44px] min-w-[44px] p-2" : "min-h-[44px] px-4";
  const variants =
    variant === "accent"
      ? "btn-accent"
      : variant === "outline"
        ? "btn-outline"
        : variant === "danger"
          ? "btn-danger"
          : "text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-bg-hover))]";
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${size} ${variants} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
