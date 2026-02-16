"use client";

import type { ReactNode } from "react";
import { Label } from "./Label";
import { Select } from "./Select";

export type SelectFieldProps = {
  /** Label teksten over feltet */
  label: ReactNode;
  /** Id til select – bruges til htmlFor på label og id på select */
  id?: string;
  /** Hjælpetekst under feltet (valgfri) */
  helperText?: ReactNode;
  /** Ekstra class på wrapper-div (fx min-w-[200px] flex-1) */
  className?: string;
  /** Ekstra class på select (sjældent nødvendig) */
  selectClassName?: string;
  children: ReactNode;
} & Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "id" | "className"
>;

/**
 * Genbrugeligt select-felt med samme struktur som TextField (label + felt + helper-slot),
 * så tekstfelter og select aligner i rækker.
 */
export function SelectField({
  label,
  id,
  helperText,
  className = "",
  selectClassName,
  children,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} className={selectClassName} {...selectProps}>
        {children}
      </Select>
      <div className="min-h-5 text-xs text-foreground-muted" aria-hidden={!helperText}>
        {helperText ?? "\u00A0"}
      </div>
    </div>
  );
}
