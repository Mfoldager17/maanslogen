"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAttributeById,
  getAllCategories,
  getAllTypes,
  type AttributeDefinition,
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

export default function AttributeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<AttributeDefinition | null>(null);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getAttributeById({ path: { id } }),
      getAllCategories(),
      getAllTypes(),
    ])
      .then(([attrRes, catRes, typesRes]) => {
        const err = (attrRes as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente attribut");
          setItem(null);
        } else {
          setItem(attrRes.data ?? null);
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
        <Alert>{error || "Attribut ikke fundet"}</Alert>
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
            <AccentLink href={`/categories/${item.categoryId}`}>
              {categoryName}
            </AccentLink>
          </DetailItem>
          <DetailItem label="Type">
            {item.typeId ? (
              <AccentLink href={`/types/${item.typeId}`}>
                {typeName}
              </AccentLink>
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
