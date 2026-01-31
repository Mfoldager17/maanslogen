"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getTypeById,
  getAllCategories,
  type BeverageType,
  type BeverageCategory,
} from "@/lib/api-client";
import {
  PageHeading,
  Card,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export default function TypeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<BeverageType | null>(null);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([getTypeById({ path: { id } }), getAllCategories()])
      .then(([typeRes, catRes]) => {
        const err = (typeRes as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente type");
          setItem(null);
        } else {
          setItem(typeRes.data ?? null);
        }
        if (catRes.data) setCategories(catRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const categoryName = item?.categoryId
    ? categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId
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
        <Alert>{error || "Type ikke fundet"}</Alert>
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
            <AccentLink href={`/categories/${item.categoryId}`}>
              {categoryName}
            </AccentLink>
          </DetailItem>
          <DetailItem label="Beskrivelse">{item.description ?? "—"}</DetailItem>
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
