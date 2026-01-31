"use client";

import { useParams } from "next/navigation";
import { getBrandById } from "@/lib/api-client";
import { useFetch } from "@/lib/hooks";
import { PageHeading, Card, Alert, AccentLink } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function BrandDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { data: item, loading, error } = useFetch(
    () => getBrandById({ path: { id } }),
    [id],
    { enabled: !!id },
  );

  if (loading) {
    return (
      <div>
        <BackLink href="/brands">← Tilbage til mærker</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/brands">← Tilbage til mærker</BackLink>
        <Alert>{error ?? "Mærke ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/brands">← Tilbage til mærker</BackLink>
      <PageHeading>{item.name ?? "Mærke"}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Navn">{item.name ?? "—"}</DetailItem>
          <DetailItem label="Beskrivelse">
            {typeof item.description === "string" ? item.description : "—"}
          </DetailItem>
          <DetailItem label="Aktiv">{item.active ? "Ja" : "Nej"}</DetailItem>
        </DetailList>
        <div className="mt-6">
          <AccentLink href={`/beverages?brandId=${encodeURIComponent(item.id ?? "")}`} small>
            Se drikkevarer for dette mærke →
          </AccentLink>
        </div>
      </Card>
    </div>
  );
}
