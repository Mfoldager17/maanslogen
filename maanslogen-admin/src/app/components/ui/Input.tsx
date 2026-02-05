import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={[
          "w-full min-w-0 h-11 py-2 px-3 rounded border border-border bg-background-elevated text-foreground placeholder:text-foreground-muted/80 box-border",
          "focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent",
          className,
        ]
          .filter(Boolean)
          .join(" ")
          .trim()}
        {...rest}
      />
    );
  }
);
