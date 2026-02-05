"use client";

import { useParams, useRouter } from "next/navigation";
import { getCategoryById, deleteCategory } from "@/lib/api-client";
import { useFetch } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { PageHeading, Card, Alert, AccentLink, LinkButton, Button } from "@/app/components/ui";
import { BackLink, IconPencil, IconTrash } from "@/app/components/layout";
import { DetailList, DetailItem, LoadingState } from "@/app/components/data";
import { useState } from "react";

export function CategoryDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: item, loading, error } = useFetch(
    () => getCategoryById({ path: { id } }),
    [id],
    { enabled: !!id },
  );

  async function onDelete() {
    const name = item?.name ?? "kategori";
    if (!confirm(`Slet kategori "${name}"? Kategorier med typer eller mærker kan ikke slettes.`)) return;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteCategory({ path: { id } });
    const err = getApiError(res);
    setDeleting(false);
    if (err) {
      setDeleteError(err);
      return;
    }
    router.push("/categories");
  }

  if (loading) {
    return (
      <div>
        <BackLink href="/categories">← Tilbage til kategorier</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/categories">← Tilbage til kategorier</BackLink>
        <Alert>{error ?? "Kategori ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/categories">← Tilbage til kategorier</BackLink>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LinkButton href={`/categories/${id}/edit`} variant="secondary" iconOnly aria-label="Rediger">
          <IconPencil className="h-5 w-5" />
        </LinkButton>
        <Button type="button" variant="danger" iconOnly aria-label="Slet" onClick={onDelete} disabled={deleting}>
          <IconTrash className="h-5 w-5" />
        </Button>
      </div>
      {deleteError && <Alert className="mb-4">{deleteError}</Alert>}
      <PageHeading>{item.name ?? "Kategori"}</PageHeading>
      <Card>
        <DetailList>
          <DetailItem label="ID" mono>{item.id}</DetailItem>
          <DetailItem label="Navn">{item.name ?? "—"}</DetailItem>
          <DetailItem label="Beskrivelse">{typeof item.description === "string" ? item.description : "—"}</DetailItem>
        </DetailList>
        <div className="mt-6">
          <LinkButton href={`/questions?categoryId=${encodeURIComponent(item.id ?? "")}`} variant="secondary">
            Se spørgsmål for denne kategori →
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
