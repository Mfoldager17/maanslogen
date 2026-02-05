"use client";

import { useParams, useRouter } from "next/navigation";
import { getCategoryById, updateCategory } from "@/lib/api-client";
import { useFetch } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { PageHeading, Card, Alert, LinkButton, Button, Input, Label } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { LoadingState } from "@/app/components/data";
import { useState, useEffect } from "react";

export function CategoryEditClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

  const { data: item, loading, error } = useFetch(
    () => getCategoryById({ path: { id } }),
    [id],
    { enabled: !!id },
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName((item as { name?: string }).name ?? "");
      setDescription((item as { description?: string }).description ?? "");
    }
  }, [item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await updateCategory({ path: { id }, body: { name: name.trim(), description: description.trim() || undefined } });
    setSubmitting(false);
    const err = getApiError(res);
    if (err) {
      setSubmitError(err);
      return;
    }
    router.push(`/categories/${id}`);
  }

  if (loading) {
    return (
      <div>
        <BackLink href={`/categories/${id}`}>← Tilbage til kategori</BackLink>
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
      <BackLink href={`/categories/${id}`}>← Tilbage til kategori</BackLink>
      <PageHeading>Rediger kategori</PageHeading>
      {submitError && <Alert className="mb-4">{submitError}</Alert>}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-row flex-wrap items-end gap-4">
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="cat-name">Navn</Label>
            <Input id="cat-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="fx Øl" />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="cat-desc">Beskrivelse</Label>
            <Input id="cat-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Valgfri" />
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Gemmer…" : "Gem"}
            </Button>
            <LinkButton href={`/categories/${id}`} variant="secondary">Annuller</LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
