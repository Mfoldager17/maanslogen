"use client";

import { useState, type ReactNode } from "react";

const COLLAPSE_DURATION = 0.2;

type CollapsibleCardProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function CollapsibleCard({
  title,
  defaultOpen = false,
  children,
  className = "",
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={[
        "overflow-hidden border border-border rounded-lg shadow-sm bg-background-elevated",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:opacity-90 focus:outline-none focus:ring-0"
        aria-expanded={open}
      >
        <span className="font-medium">{title}</span>
        <svg
          className="h-5 w-5 shrink-0 text-foreground-muted transition-transform duration-200 ease-out"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Grid 0fr → 1fr med transition giver smooth height-animation (som draweren) */}
      <div
        className="grid transition-[grid-template-rows] ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionDuration: `${COLLAPSE_DURATION}s`,
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-border p-6 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
