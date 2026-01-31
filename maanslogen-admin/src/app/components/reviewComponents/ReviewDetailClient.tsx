"use client";

import { useParams } from "next/navigation";
import { getReviewById, getAllBeverages } from "@/lib/api-client";
import type { Review } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import {
  PageHeading,
  Card,
  SectionHeading,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

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
  const id = (params?.id as string) ?? "";

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

  return (
    <div>
      <BackLink href="/reviews">← Tilbage til anmeldelser</BackLink>
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
                className="border-b border-[rgb(var(--color-border))] pb-4 last:border-0 last:pb-0"
              >
                <p className="text-heading-muted mb-1 text-sm font-medium">
                  {a.question?.questionText ?? "Spørgsmål"}
                </p>
                <p className="text-heading">
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
