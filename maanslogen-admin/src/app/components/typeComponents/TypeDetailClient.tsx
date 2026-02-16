"use client";

import { useParams, useRouter } from "next/navigation";
import { getTypeById, getAllCategories, deleteType } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { PageHeading, Card, Alert, AccentLink, LinkButton, Button } from "@/app/components/ui";
import { BackLink, IconPencil, IconTrash } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";
import { useState } from "react";

export function TypeDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  async function onDelete() {
    const name = item?.name ?? "type";
    if (!confirm(`Slet type "${name}"? Typer med drikkevarer kan ikke slettes.`)) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteType({ path: { id } });
    const err = getApiError(res);
    setDeleting(false);
    if (err) {
      setDeleteError(err);
      return;
    }
    router.push("/types");
  }

  return (
    <div>
      <BackLink href="/types">← Tilbage til typer</BackLink>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LinkButton href={`/types/${id}/edit`} variant="secondary" iconOnly aria-label="Rediger">
          <IconPencil className="h-5 w-5" />
        </LinkButton>
        <Button type="button" variant="danger" iconOnly aria-label="Slet" onClick={onDelete} disabled={deleting}>
          <IconTrash className="h-5 w-5" />
        </Button>
      </div>
      {deleteError && <Alert className="mb-4">{deleteError}</Alert>}
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
          <LinkButton
            href={`/questions?typeId=${encodeURIComponent(item.id ?? "")}&categoryId=${encodeURIComponent(item.categoryId ?? "")}`}
            variant="secondary"
          >
            Se spørgsmål for denne type →
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
