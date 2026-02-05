"use client";

import type { ReactNode } from "react";
import { IconFunnel } from "@/app/components/layout";
import { Label } from "./Label";
import { Select } from "./Select";

type FilterBarProps = {
  children: ReactNode;
  hasActiveFilters?: boolean;
  onClear?: () => void;
  className?: string;
};

/**
 * Filterbar med kortstil: header (ikon + "Filtre" + Nulstil) og body med felter (label over select).
 */
export function FilterBar({
  children,
  hasActiveFilters = false,
  onClear,
  className = "",
}: FilterBarProps) {
  return (
    <div
      className={[
        "overflow-hidden rounded-lg border border-border bg-background-elevated shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
            <IconFunnel className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-foreground">Filtre</span>
        </div>
        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-foreground-muted underline decoration-foreground-muted/40 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background-elevated rounded"
          >
            Nulstil
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-end gap-6 px-4 py-4">{children}</div>
    </div>
  );
}

type FilterBarFieldProps = {
  label: string;
  id?: string;
  className?: string;
  selectClassName?: string;
  children: ReactNode;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id" | "className">;

/**
 * Filterfelt med label over select – samme struktur som tekstfelter, til brug inde i FilterBar.
 */
function FilterBarField({
  label,
  id,
  className = "",
  selectClassName,
  children,
  ...selectProps
}: FilterBarFieldProps) {
  const generatedId = id ?? `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={["flex flex-col gap-1 min-w-40", className].filter(Boolean).join(" ")}>
      <Label htmlFor={generatedId}>{label}</Label>
      <Select
        id={generatedId}
        className={["h-11 min-w-0 text-sm", selectClassName].filter(Boolean).join(" ")}
        {...selectProps}
      >
        {children}
      </Select>
    </div>
  );
}

FilterBar.Field = FilterBarField;
