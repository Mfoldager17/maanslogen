"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategoryById, type BeverageCategory } from "@/lib/api-client";
import {
  PageHeading,
  Card,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export default function CategoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<BeverageCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getCategoryById({ path: { id } })
      .then((res) => {
        const err = (res as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente kategori");
          setItem(null);
        } else {
          setItem(res.data ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <BackLink href="/categories">← Tilbage til kategorier</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/categories">← Tilbage til kategorier</BackLink>
        <Alert>{error || "Kategori ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/categories">← Tilbage til kategorier</BackLink>
      <PageHeading>{item.name ?? "Kategori"}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Navn">{item.name ?? "—"}</DetailItem>
          <DetailItem label="Beskrivelse">{item.description ?? "—"}</DetailItem>
        </DetailList>
        <div className="mt-6">
          <AccentLink
            href={`/questions?categoryId=${encodeURIComponent(item.id ?? "")}`}
            small
          >
            Se spørgsmål for denne kategori →
          </AccentLink>
        </div>
      </Card>
    </div>
  );
}
