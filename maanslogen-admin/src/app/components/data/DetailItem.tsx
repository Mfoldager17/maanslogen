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
      <dt className="text-heading-muted text-sm font-medium">{label}</dt>
      <dd
        className={
          mono ? "text-heading font-mono text-sm" : "text-heading"
        }
      >
        {children}
      </dd>
    </div>
  );
}
