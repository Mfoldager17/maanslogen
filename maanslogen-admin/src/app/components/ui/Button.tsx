import type { ReactNode } from "react";

export function Button({
  children,
  type = "button",
  disabled,
  className = "",
  variant = "accent",
  ...rest
}: {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "accent" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "rounded-theme min-h-[44px] px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants =
    variant === "accent"
      ? "btn-accent"
      : "text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-bg-hover))]";
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
