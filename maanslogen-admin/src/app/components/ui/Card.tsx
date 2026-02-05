import type { ReactNode } from "react";

const cardClass = (padding: boolean, className: string) =>
  `card ${padding ? "p-6" : ""} ${className}`.trim();

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  as?: "div" | "form";
} & (React.HTMLAttributes<HTMLDivElement> | React.FormHTMLAttributes<HTMLFormElement>);

export function Card({
  children,
  className = "",
  padding = true,
  as: As = "div",
  ...rest
}: CardProps) {
  return (
    <As className={cardClass(padding, className)} {...(rest as React.HTMLAttributes<HTMLElement>)}>
      {children}
    </As>
  );
}
