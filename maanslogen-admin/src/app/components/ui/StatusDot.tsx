export function StatusDot({
  active,
  className = "",
}: {
  active: boolean;
  className?: string;
}) {
  const label = active ? "Aktiv" : "Inaktiv";
  return (
    <span
      className={`group relative inline-flex shrink-0 ${className}`.trim()}
      title={label}
      aria-label={label}
      role="img"
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`}
      />
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-background-elevated px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
        aria-hidden
      >
        {label}
      </span>
    </span>
  );
}
