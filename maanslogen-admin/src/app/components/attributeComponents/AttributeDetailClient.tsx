"use client";

import { useParams } from "next/navigation";
import { getAttributeById, getAllCategories, getAllTypes } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { PageHeading, Card, Alert, AccentLink } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function AttributeDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { data, loading, error } = useFetchAll(
    [
      () => getAttributeById({ path: { id } }),
      () => getAllCategories(),
      () => getAllTypes(),
    ],
    [id],
    { enabled: !!id },
  );

  const [item, categories, types] = data ?? [null, null, null];
  const catIds = (item as { categoryIds?: string[]; categoryId?: string })?.categoryIds ?? (item?.categoryId ? [item.categoryId] : []);
  const categoryLabels = catIds.map((cid) => (categories?.find((c) => c.id === cid)?.name ?? cid)).join(", ") || "—";
  const typIds = (item as { typeIds?: string[]; typeId?: unknown })?.typeIds ?? (typeof item?.typeId === "string" ? [item.typeId] : []);
  const typeLabels = typIds.map((tid) => (types?.find((t) => t.id === tid)?.name ?? tid)).join(", ") || "—";

  if (loading) {
    return (
      <div>
        <BackLink href="/attributes">← Tilbage til attributter</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/attributes">← Tilbage til attributter</BackLink>
        <Alert>{error ?? "Attribut ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/attributes">← Tilbage til attributter</BackLink>
      <PageHeading>{item.displayName ?? item.attributeKey ?? "Attribut"}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Nøgle">{item.attributeKey ?? "—"}</DetailItem>
          <DetailItem label="Visningsnavn">{item.displayName ?? "—"}</DetailItem>
          <DetailItem label="Kategorier">
            {catIds.length ? (
              <>
                {catIds.map((cid, i) => (
                  <span key={cid}>
                    {i > 0 && ", "}
                    <AccentLink href={`/categories/${cid}`}>
                      {categories?.find((c) => c.id === cid)?.name ?? cid}
                    </AccentLink>
                  </span>
                ))}
              </>
            ) : (
              "—"
            )}
          </DetailItem>
          <DetailItem label="Typer">
            {typIds.length ? (
              <>
                {typIds.map((tid, i) => (
                  <span key={tid}>
                    {i > 0 && ", "}
                    <AccentLink href={`/types/${tid}`}>
                      {types?.find((t) => t.id === tid)?.name ?? tid}
                    </AccentLink>
                  </span>
                ))}
              </>
            ) : (
              "Alle typer i kategorierne"
            )}
          </DetailItem>
          <DetailItem label="Datatype">{item.dataType ?? "—"}</DetailItem>
          <DetailItem label="Filterbar">{item.filterable ? "Ja" : "Nej"}</DetailItem>
          <DetailItem label="Påkrævet">{item.required ? "Ja" : "Nej"}</DetailItem>
        </DetailList>
      </Card>
    </div>
  );
}
