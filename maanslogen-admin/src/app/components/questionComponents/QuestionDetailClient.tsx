"use client";

import { useParams } from "next/navigation";
import { getQuestionById, getAllCategories, getAllTypes } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { PageHeading, Card, Alert, AccentLink } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function QuestionDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { data, loading, error } = useFetchAll(
    [
      () => getQuestionById({ path: { id } }),
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
    : null;

  if (loading) {
    return (
      <div>
        <BackLink href="/questions">← Tilbage til spørgsmål</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/questions">← Tilbage til spørgsmål</BackLink>
        <Alert>{error ?? "Spørgsmål ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/questions">← Tilbage til spørgsmål</BackLink>
      <PageHeading>{item.questionText ?? "Spørgsmål"}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Spørgsmålstekst">{item.questionText ?? "—"}</DetailItem>
          <DetailItem label="Kategori">
            <AccentLink href={`/categories/${item.categoryId}`}>{categoryName}</AccentLink>
          </DetailItem>
          <DetailItem label="Type">
            {typeName ? (
              <AccentLink href={`/types/${item.typeId}`}>{typeName}</AccentLink>
            ) : (
              "Hele kategorien"
            )}
          </DetailItem>
          <DetailItem label="Svar-type">{item.answerType ?? "—"}</DetailItem>
          <DetailItem label="Rækkefølge">{typeof item.sortOrder === "number" ? item.sortOrder : "—"}</DetailItem>
          <DetailItem label="Påkrævet">{item.required ? "Ja" : "Nej"}</DetailItem>
        </DetailList>
      </Card>
    </div>
  );
}
