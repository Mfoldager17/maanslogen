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
  const base =
    "inline-flex items-center justify-center rounded font-medium transition-colors focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";
  const size = iconOnly ? "min-h-[44px] min-w-[44px] p-2" : "min-h-[44px] px-4";
  const variants =
    variant === "accent"
      ? "bg-accent text-accent-foreground border-none shadow-[0_2px_8px_rgb(var(--color-accent)/0.35)] hover:bg-accent-hover hover:shadow-[0_4px_12px_rgb(var(--color-accent)/0.4)]"
      : variant === "outline"
        ? "bg-accent/22 text-accent border-none hover:bg-accent/38 hover:text-accent-hover"
        : variant === "danger"
          ? "bg-[rgb(239_68_68/0.15)] text-[rgb(185_28_28)] border-none hover:bg-[rgb(239_68_68/0.28)] hover:text-[rgb(153_27_27)] [[data-theme=dark]_&]:text-[rgb(254_202_202)] [[data-theme=dark]_&]:hover:bg-[rgb(239_68_68/0.35)] [[data-theme=dark]_&]:hover:text-[rgb(254_226_226)]"
          : "text-foreground hover:bg-background-hover";
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
