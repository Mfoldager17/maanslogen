"use client";

import { useParams, useRouter } from "next/navigation";
import { getReviewById, getAllBeverages, deleteReview } from "@/lib/api-client";
import type { Review } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import {
  PageHeading,
  Card,
  SectionHeading,
  Alert,
  AccentLink,
  Button,
} from "@/app/components/ui";
import { BackLink, IconTrash } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";
import { useState } from "react";

type ReviewWithAnswers = Review & {
  answers?: Array<{
    id?: string;
    questionId?: string;
    question?: { questionText?: string };
    answer?: unknown;
  }>;
};

export function ReviewDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, loading, error } = useFetchAll(
    [() => getReviewById({ path: { id } }), () => getAllBeverages()],
    [id],
    { enabled: !!id },
  );

  const [item, beverages] = data ?? [null, null];
  const beverage = item?.beverageId && beverages?.length
    ? beverages.find((b) => b.id === item.beverageId)
    : null;
  const beverageLabel = beverage
    ? `${typeof beverage.brand === "object" && beverage.brand?.name != null ? beverage.brand.name : (beverage as { brand?: string }).brand ?? ""} – ${beverage.name}`
    : item?.beverageId ?? "—";

  if (loading) {
    return (
      <div>
        <BackLink href="/reviews">← Tilbage til anmeldelser</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/reviews">← Tilbage til anmeldelser</BackLink>
        <Alert>{error ?? "Anmeldelse ikke fundet"}</Alert>
      </div>
    );
  }

  const itemWithAnswers = item as ReviewWithAnswers;
  const answers = itemWithAnswers.answers ?? [];

  async function onDelete() {
    if (!confirm("Slet denne anmeldelse? Drikkevarens anmeldelsestælling opdateres.")) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteReview({ path: { id } });
    const err = getApiError(res);
    setDeleting(false);
    if (err) {
      setDeleteError(err);
      return;
    }
    router.push("/reviews");
  }

  return (
    <div>
      <BackLink href="/reviews">← Tilbage til anmeldelser</BackLink>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="danger"
          iconOnly
          aria-label="Slet"
          onClick={onDelete}
          disabled={deleting}
        >
          <IconTrash className="h-5 w-5" />
        </Button>
      </div>
      {deleteError && <Alert className="mb-4">{deleteError}</Alert>}
      <PageHeading>
        {typeof item.title === "string" ? item.title : `Anmeldelse – ${item.rating}★`}
      </PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Bedømmelse">{item.rating ?? "—"}</DetailItem>
          <DetailItem label="Titel">{typeof item.title === "string" ? item.title : "—"}</DetailItem>
          <DetailItem label="Drikkevare">
            <AccentLink href={`/beverages/${item.beverageId}`}>{beverageLabel}</AccentLink>
          </DetailItem>
          <DetailItem label="Bruger-ID" mono>{item.userId}</DetailItem>
          <DetailItem label="Beskrivelse">
            <span className="whitespace-pre-wrap">
              {typeof item.description === "string" ? item.description : "—"}
            </span>
          </DetailItem>
        </DetailList>
      </Card>

      {answers.length > 0 && (
        <Card className="mt-6">
          <SectionHeading className="mb-4">Spørgsmål og svar</SectionHeading>
          <ul className="space-y-4">
            {answers.map((a) => (
              <li
                key={a.id ?? a.questionId}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <p className="text-foreground-muted mb-1 text-sm font-medium">
                  {a.question?.questionText ?? "Spørgsmål"}
                </p>
                <p className="text-foreground">
                  {typeof a.answer === "string" || typeof a.answer === "number" ? a.answer : "—"}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
