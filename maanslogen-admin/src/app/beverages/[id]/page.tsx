"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getBeverageById,
  getAllTypes,
  type Beverage,
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

export default function BeverageDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<Beverage | null>(null);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([getBeverageById({ path: { id } }), getAllTypes()])
      .then(([bevRes, typesRes]) => {
        const err = (bevRes as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente drikkevare");
          setItem(null);
        } else {
          setItem(bevRes.data ?? null);
        }
        if (typesRes.data) setTypes(typesRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const typeName = item?.beverageTypeId
    ? types.find((t) => t.id === item.beverageTypeId)?.name ?? item.beverageTypeId
    : "—";

  if (loading) {
    return (
      <div>
        <BackLink href="/beverages">← Tilbage til drikkevarer</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/beverages">← Tilbage til drikkevarer</BackLink>
        <Alert>{error || "Drikkevare ikke fundet"}</Alert>
      </div>
    );
  }

  const images = item.images ?? [];
  const largeImage = images.find((img) => img.type === "LARGE") ?? images[0];

  return (
    <div>
      <BackLink href="/beverages">← Tilbage til drikkevarer</BackLink>
      <PageHeading>{item.brand} – {item.name}</PageHeading>

      <Card className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {largeImage?.url && (
          <div className="flex shrink-0 justify-center sm:order-2 sm:justify-end">
            <img
              src={largeImage.url}
              alt={item.name ?? "Billede"}
              className="max-h-80 w-auto max-w-full rounded-lg object-contain sm:max-h-[400px]"
              width={largeImage.width ?? undefined}
              height={largeImage.height ?? undefined}
            />
          </div>
        )}
        <DetailList className="min-w-0 flex-1 sm:order-1">
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Mærke">{item.brand ?? "—"}</DetailItem>
          <DetailItem label="Navn">{item.name ?? "—"}</DetailItem>
          <DetailItem label="Type">
            <AccentLink href={`/types/${item.beverageTypeId}`}>
              {typeName}
            </AccentLink>
          </DetailItem>
          <DetailItem label="Land">{item.country ?? "—"}</DetailItem>
          <DetailItem label="Gns. bedømmelse">
            {item.averageRating != null ? item.averageRating.toFixed(1) : "—"}
          </DetailItem>
          <DetailItem label="Antal anmeldelser">{item.reviewCount ?? 0}</DetailItem>
        </DetailList>
      </Card>
    </div>
  );
}
