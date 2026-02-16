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
    <select
      className={[
        "w-full min-w-0 h-11 py-2 pl-3 pr-10 rounded border border-border bg-background-elevated text-foreground appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_0.75rem_center] focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent box-border",
        className,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
