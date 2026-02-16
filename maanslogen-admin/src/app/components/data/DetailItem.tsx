import type { ReactNode } from "react";

export function DetailItem({
  label,
  children,
  mono,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-foreground-muted text-sm font-medium">{label}</dt>
      <dd
        className={
          mono ? "text-foreground font-mono text-sm" : "text-foreground"
        }
      >
        {children}
      </dd>
    </div>
  );
}
