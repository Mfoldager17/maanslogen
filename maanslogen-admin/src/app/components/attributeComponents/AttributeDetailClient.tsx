"use client";

import { useParams, useRouter } from "next/navigation";
import { getAttributeById, getAllCategories, getAllTypes, deleteAttribute } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { PageHeading, Card, Alert, AccentLink, LinkButton, Button } from "@/app/components/ui";
import { BackLink, IconPencil, IconTrash } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";
import { useState } from "react";

export function AttributeDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
  const catIds = (item as { categoryIds?: string[] })?.categoryIds ?? [];
  const categoryLabels = catIds.map((cid) => (categories?.find((c) => c.id === cid)?.name ?? cid)).join(", ") || "—";
  const typIds = (item as { typeIds?: string[] })?.typeIds ?? [];
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

  async function onDelete() {
    const name = item?.displayName ?? item?.attributeKey ?? "attribut";
    if (!confirm(`Slet attributedefinition "${name}"? Dette sletter også alle tilknyttede attributværdier.`)) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteAttribute({ path: { id } });
    const err = getApiError(res);
    setDeleting(false);
    if (err) {
      setDeleteError(err);
      return;
    }
    router.push("/attributes");
  }

  return (
    <div>
      <BackLink href="/attributes">← Tilbage til attributter</BackLink>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LinkButton href={`/attributes/${id}/edit`} variant="secondary" iconOnly aria-label="Rediger">
          <IconPencil className="h-5 w-5" />
        </LinkButton>
        <Button type="button" variant="danger" iconOnly aria-label="Slet" onClick={onDelete} disabled={deleting}>
          <IconTrash className="h-5 w-5" />
        </Button>
      </div>
      {deleteError && <Alert className="mb-4">{deleteError}</Alert>}
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
