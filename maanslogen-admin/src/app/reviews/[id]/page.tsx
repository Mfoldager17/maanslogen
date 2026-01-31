"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getReviewById,
  getAllBeverages,
  type Review,
  type Beverage,
} from "@/lib/api-client";
import {
  PageHeading,
  Card,
  SectionHeading,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export default function ReviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<Review | null>(null);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([getReviewById({ path: { id } }), getAllBeverages()])
      .then(([reviewRes, bevRes]) => {
        const err = (reviewRes as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente anmeldelse");
          setItem(null);
        } else {
          setItem(reviewRes.data ?? null);
        }
        if (bevRes.data) setBeverages(bevRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const beverage = item?.beverageId
    ? beverages.find((b) => b.id === item.beverageId)
    : null;
  const beverageLabel = beverage ? `${beverage.brand} – ${beverage.name}` : item?.beverageId ?? "—";

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
        <Alert>{error || "Anmeldelse ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/reviews">← Tilbage til anmeldelser</BackLink>
      <PageHeading>{item.title ?? `Anmeldelse – ${item.rating}★`}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Bedømmelse">{item.rating ?? "—"}</DetailItem>
          <DetailItem label="Titel">{item.title ?? "—"}</DetailItem>
          <DetailItem label="Drikkevare">
            <AccentLink href={`/beverages/${item.beverageId}`}>
              {beverageLabel}
            </AccentLink>
          </DetailItem>
          <DetailItem label="Bruger-ID" mono>{item.userId}</DetailItem>
          <DetailItem label="Beskrivelse">
            <span className="whitespace-pre-wrap">{item.description ?? "—"}</span>
          </DetailItem>
        </DetailList>
      </Card>

      {item.answers && item.answers.length > 0 && (
        <Card className="mt-6">
          <SectionHeading className="mb-4">Spørgsmål og svar</SectionHeading>
          <ul className="space-y-4">
            {item.answers.map((a) => (
              <li key={a.id ?? a.questionId} className="border-b border-[rgb(var(--color-border))] pb-4 last:border-0 last:pb-0">
                <p className="text-heading-muted mb-1 text-sm font-medium">
                  {a.question?.questionText ?? "Spørgsmål"}
                </p>
                <p className="text-heading">{a.answer ?? "—"}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
