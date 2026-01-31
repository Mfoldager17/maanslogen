"use client";

import { useParams } from "next/navigation";
import { getBrandById, getAllCategories } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { PageHeading, Card, Alert, AccentLink } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function BrandDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { data, loading, error } = useFetchAll(
    [() => getBrandById({ path: { id } }), () => getAllCategories()],
    [id],
    { enabled: !!id },
  );

  const [item, categories] = data ?? [null, null];
  const categoryIds = (item as { categoryIds?: string[] })?.categoryIds ?? [];
  const categoryMap = categories?.length ? Object.fromEntries(categories.map((c) => [c.id, c])) : {};

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
          <DetailItem label="Tilladte kategorier">
            {categoryIds.length === 0 ? (
              "Alle kategorier"
            ) : (
              <>
                {categoryIds.map((cid, i) => (
                  <span key={cid}>
                    {i > 0 && ", "}
                    <AccentLink href={`/categories/${cid}`}>{categoryMap[cid]?.name ?? cid}</AccentLink>
                  </span>
                ))}
              </>
            )}
          </DetailItem>
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
