import { Suspense } from "react";
import { QuestionsPageClient } from "@/app/components/questionComponents";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="text-foreground-muted">Henter…</div>}>
      <QuestionsPageClient />
    </Suspense>
  );
}
