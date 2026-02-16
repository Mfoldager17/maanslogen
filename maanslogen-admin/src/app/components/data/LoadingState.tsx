export function LoadingState({ text = "Henter…" }: { text?: string }) {
  return <p className="text-foreground-muted">{text}</p>;
}
