"use client";

import { useParams } from "next/navigation";
import { getCategoryById } from "@/lib/api-client";
import { useFetch } from "@/lib/hooks";
import { PageHeading, Card, Alert, AccentLink } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function CategoryDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { data: item, loading, error } = useFetch(
    () => getCategoryById({ path: { id } }),
    [id],
    { enabled: !!id },
  );

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
        <Alert>{error ?? "Kategori ikke fundet"}</Alert>
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
          <DetailItem label="Beskrivelse">{typeof item.description === "string" ? item.description : "—"}</DetailItem>
        </DetailList>
        <div className="mt-6">
          <AccentLink href={`/questions?categoryId=${encodeURIComponent(item.id ?? "")}`} small>
            Se spørgsmål for denne kategori →
          </AccentLink>
        </div>
      </Card>
    </div>
  );
}
