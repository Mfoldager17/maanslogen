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
  const categoryName = item?.categoryId && categories?.length
    ? (categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId)
    : "—";
  const typeIdStr = typeof item?.typeId === "string" ? item.typeId : undefined;
  const typeName = typeIdStr && types?.length
    ? (types.find((t) => t.id === typeIdStr)?.name ?? typeIdStr)
    : "—";

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
          <DetailItem label="Kategori">
            <AccentLink href={`/categories/${item.categoryId}`}>{categoryName}</AccentLink>
          </DetailItem>
          <DetailItem label="Type">
            {typeIdStr ? (
              <AccentLink href={`/types/${typeIdStr}`}>{typeName}</AccentLink>
            ) : (
              "Hele kategorien"
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
