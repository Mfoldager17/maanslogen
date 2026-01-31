export function LoadingState({ text = "Henter…" }: { text?: string }) {
  return <p className="text-heading-muted">{text}</p>;
}
