import { Suspense } from "react";
import { QuestionsPageClient } from "@/app/components/questionComponents";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="text-heading-muted">Henter…</div>}>
      <QuestionsPageClient />
    </Suspense>
  );
}
