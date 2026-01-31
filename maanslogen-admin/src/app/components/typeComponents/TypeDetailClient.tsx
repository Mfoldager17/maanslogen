"use client";

import { useParams } from "next/navigation";
import { getTypeById, getAllCategories } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { PageHeading, Card, Alert, AccentLink } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function TypeDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { data, loading, error } = useFetchAll(
    [() => getTypeById({ path: { id } }), () => getAllCategories()],
    [id],
    { enabled: !!id },
  );

  const [item, categories] = data ?? [null, null];
  const categoryName = item?.categoryId && categories?.length
    ? (categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId)
    : "—";

  if (loading) {
    return (
      <div>
        <BackLink href="/types">← Tilbage til typer</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/types">← Tilbage til typer</BackLink>
        <Alert>{error ?? "Type ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/types">← Tilbage til typer</BackLink>
      <PageHeading>{item.name ?? "Type"}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Navn">{item.name ?? "—"}</DetailItem>
          <DetailItem label="Kategori">
            <AccentLink href={`/categories/${item.categoryId}`}>{categoryName}</AccentLink>
          </DetailItem>
          <DetailItem label="Beskrivelse">{typeof item.description === "string" ? item.description : "—"}</DetailItem>
          <DetailItem label="Aktiv">{item.active ? "Ja" : "Nej"}</DetailItem>
        </DetailList>
        <div className="mt-6">
          <AccentLink
            href={`/questions?typeId=${encodeURIComponent(item.id ?? "")}&categoryId=${encodeURIComponent(item.categoryId ?? "")}`}
            small
          >
            Se spørgsmål for denne type →
          </AccentLink>
        </div>
      </Card>
    </div>
  );
}
