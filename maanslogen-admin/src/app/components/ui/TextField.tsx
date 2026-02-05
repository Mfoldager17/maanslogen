"use client";

import { forwardRef, type ReactNode } from "react";
import { Input } from "./Input";
import { Label } from "./Label";

export type TextFieldProps = {
  /** Label teksten over feltet */
  label: ReactNode;
  /** Id til input – bruges til htmlFor på label og id på input */
  id?: string;
  /** Hjælpetekst under feltet (valgfri) */
  helperText?: string;
  /** Om feltet er i fejl – viser helperText som fejl og sætter aria-invalid */
  error?: boolean;
  /** Ekstra class på wrapper-div (fx w-20, flex-1) */
  className?: string;
  /** Ekstra class på input (sjældent nødvendig) */
  inputClassName?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "className"
>;

/**
 * Genbrugeligt tekstfelt: label + input + reserveret plads til helpertekst,
 * så felter i rækker beholder alignment når ét felt får fejltekst.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      id,
      helperText,
      error = false,
      className = "",
      inputClassName,
      ...inputProps
    },
    ref
  ) {
    const hasHelper = !!helperText || error;
    const helperId = id ? `${id}-helper` : undefined;

    return (
      <div className={`flex flex-col gap-1 ${className}`.trim()}>
        <Label htmlFor={id}>{label}</Label>
        <Input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasHelper ? helperId : undefined}
          className={inputClassName}
          {...inputProps}
        />
        <div
          className={`min-h-5 text-xs ${error ? "text-red-600 dark:text-red-400" : "text-foreground-muted"}`}
          id={helperId}
          role={error ? "alert" : undefined}
          aria-hidden={!hasHelper}
        >
          {helperText ?? "\u00A0"}
        </div>
      </div>
    );
  }
);
