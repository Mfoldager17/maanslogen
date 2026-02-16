"use client";

import { useParams } from "next/navigation";
import { useArrangementById } from "@/lib/hooks";
import { BackLink, IconPencil } from "@/app/components/layout";
import { PageHeading, Card, Alert, AccentLink, LinkButton } from "@/app/components/ui";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";

export function ArrangementDetailClient() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const { item, loading, error } = useArrangementById(id);

  if (loading) {
    return (
      <div>
        <BackLink href="/arrangements">← Tilbage til arrangementer</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/arrangements">← Tilbage til arrangementer</BackLink>
        <Alert>{error ?? "Arrangement ikke fundet"}</Alert>
      </div>
    );
  }

  const beverages = item.beverages ?? [];

  return (
    <div>
      <BackLink href="/arrangements">← Tilbage til arrangementer</BackLink>
      <div className="flex items-center justify-between gap-4">
        <PageHeading>{item.name}</PageHeading>
        <LinkButton href={`/arrangements/${encodeURIComponent(item.id)}/edit`} variant="secondary">
          <IconPencil className="h-5 w-5" />
          Rediger
        </LinkButton>
      </div>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Type">{item.type === "TASTING" ? "Smagning" : item.type}</DetailItem>
          <DetailItem label="Navn">{item.name}</DetailItem>
          <DetailItem label="Beskrivelse">{item.description ?? "—"}</DetailItem>
          <DetailItem label="Oprettet af (bruger-id)">{item.createdById}</DetailItem>
          <DetailItem label="Oprettet">{item.createdAt ? new Date(item.createdAt).toLocaleString("da-DK") : "—"}</DetailItem>
        </DetailList>
        {beverages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground-muted mb-2">Drikkevarer (rækkefølge)</h3>
            <ol className="list-decimal list-inside space-y-2">
              {beverages.map((row, i) => (
                <li key={row.id}>
                  <AccentLink href={`/beverages/${encodeURIComponent(row.beverage.id)}`}>
                    {row.beverage.name}
                    {row.beverage.brand?.name ? ` (${row.beverage.brand.name})` : ""}
                  </AccentLink>
                  {row.beverage.averageRating != null && (
                    <span className="text-foreground-muted text-sm ml-2">
                      {row.beverage.averageRating.toFixed(1)} ★ ({row.beverage.reviewCount ?? 0} anmeldelser)
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>
    </div>
  );
}
