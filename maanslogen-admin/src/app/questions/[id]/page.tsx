"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getQuestionById,
  getAllCategories,
  getAllTypes,
  type Question,
  type BeverageCategory,
  type BeverageType,
} from "@/lib/api-client";
import {
  PageHeading,
  Card,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<Question | null>(null);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getQuestionById({ path: { id } }),
      getAllCategories(),
      getAllTypes(),
    ])
      .then(([qRes, catRes, typesRes]) => {
        const err = (qRes as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente spørgsmål");
          setItem(null);
        } else {
          setItem(qRes.data ?? null);
        }
        if (catRes.data) setCategories(catRes.data);
        if (typesRes.data) setTypes(typesRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const categoryName = item?.categoryId
    ? categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId
    : "—";
  const typeName = item?.typeId
    ? types.find((t) => t.id === item.typeId)?.name ?? item.typeId
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
        <Alert>{error || "Spørgsmål ikke fundet"}</Alert>
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
            <AccentLink href={`/categories/${item.categoryId}`}>
              {categoryName}
            </AccentLink>
          </DetailItem>
          <DetailItem label="Type">
            {typeName ? (
              <AccentLink href={`/types/${item.typeId}`}>
                {typeName}
              </AccentLink>
            ) : (
              "Hele kategorien"
            )}
          </DetailItem>
          <DetailItem label="Svar-type">{item.answerType ?? "—"}</DetailItem>
          <DetailItem label="Rækkefølge">{item.sortOrder != null ? item.sortOrder : "—"}</DetailItem>
          <DetailItem label="Påkrævet">{item.required ? "Ja" : "Nej"}</DetailItem>
        </DetailList>
      </Card>
    </div>
  );
}
