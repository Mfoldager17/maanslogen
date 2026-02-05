"use client";

import { useParams, useRouter } from "next/navigation";
import { getBeverageById, getAllTypes, deleteBeverage } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { PageHeading, Card, Alert, AccentLink, Button } from "@/app/components/ui";
import { BackLink, IconTrash } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";
import { useState } from "react";

export function BeverageDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, loading, error } = useFetchAll(
    [() => getBeverageById({ path: { id } }), () => getAllTypes()],
    [id],
    { enabled: !!id },
  );

  const [item, types] = data ?? [null, null];
  const typeName = item?.beverageTypeId && types?.length
    ? (types.find((t) => t.id === item.beverageTypeId)?.name ?? item.beverageTypeId)
    : "—";
  const brandName = item
    ? (typeof item.brand === "object" && item.brand?.name != null ? item.brand.name : (item as { brand?: string }).brand ?? "—")
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
        <Alert>{error ?? "Drikkevare ikke fundet"}</Alert>
      </div>
    );
  }

  async function onDelete() {
    const label = `${brandName} – ${item?.name ?? ""}`;
    if (!confirm(`Slet drikkevare "${label}"? Dette sletter også anmeldelser og attributværdier.`)) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteBeverage({ path: { id } });
    const err = getApiError(res);
    setDeleting(false);
    if (err) {
      setDeleteError(err);
      return;
    }
    router.push("/beverages");
  }

  const images = item.images ?? [];
  const largeImage = images.find((img) => img.type === "LARGE") ?? images[0];

  return (
    <div>
      <BackLink href="/beverages">← Tilbage til drikkevarer</BackLink>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="danger"
          iconOnly
          aria-label="Slet"
          onClick={onDelete}
          disabled={deleting}
        >
          <IconTrash className="h-5 w-5" />
        </Button>
      </div>
      {deleteError && <Alert className="mb-4">{deleteError}</Alert>}
      <PageHeading>{brandName} – {item.name}</PageHeading>

      <Card className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {largeImage?.url && (
          <div className="flex shrink-0 justify-center sm:order-2 sm:justify-end">
            <img
              src={largeImage.url}
              alt={item.name ?? "Billede"}
              className="max-h-80 w-auto max-w-full rounded-lg object-contain sm:max-h-[400px]"
              width={typeof largeImage.width === "number" ? largeImage.width : undefined}
              height={typeof largeImage.height === "number" ? largeImage.height : undefined}
            />
          </div>
        )}
        <DetailList className="min-w-0 flex-1 sm:order-1">
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Mærke">{brandName}</DetailItem>
          <DetailItem label="Navn">{item.name ?? "—"}</DetailItem>
          <DetailItem label="Type">
            <AccentLink href={`/types/${item.beverageTypeId}`}>{typeName}</AccentLink>
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
