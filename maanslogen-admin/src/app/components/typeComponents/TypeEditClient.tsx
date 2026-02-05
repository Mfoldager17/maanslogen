"use client";

import { useParams, useRouter } from "next/navigation";
import { getTypeById, getAllCategories, updateType } from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { PageHeading, Card, Alert, LinkButton, Button, Input, Label, Select } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { LoadingState } from "@/app/components/data";
import { useState, useEffect } from "react";

export function TypeEditClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

  const { data, loading, error } = useFetchAll(
    [() => getTypeById({ path: { id } }), () => getAllCategories()],
    [id],
    { enabled: !!id },
  );

  const [item, categories] = data ?? [null, null];
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName((item as { name?: string }).name ?? "");
      setCategoryId((item as { categoryId?: string }).categoryId ?? "");
      setDescription((item as { description?: string }).description ?? "");
      setActive((item as { active?: boolean }).active ?? true);
    }
  }, [item]);

  useEffect(() => {
    const firstId = categories?.[0]?.id;
    if (categories?.length && !categoryId && firstId) setCategoryId(firstId);
  }, [categories, categoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await updateType({ path: { id }, body: { name: name.trim(), categoryId, description: description.trim() || undefined, active } });
    setSubmitting(false);
    const err = getApiError(res);
    if (err) {
      setSubmitError(err);
      return;
    }
    router.push(`/types/${id}`);
  }

  if (loading) {
    return (
      <div>
        <BackLink href={`/types/${id}`}>← Tilbage til type</BackLink>
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

  return (
    <div>
      <BackLink href={`/types/${id}`}>← Tilbage til type</BackLink>
      <PageHeading>Rediger type</PageHeading>
      {submitError && <Alert className="mb-4">{submitError}</Alert>}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-row flex-wrap items-end gap-4">
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="type-name">Navn</Label>
            <Input id="type-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="fx IPA" />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="type-cat">Kategori</Label>
            <Select id="type-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="type-desc">Beskrivelse</Label>
            <Input id="type-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Valgfri" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="type-active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
            />
            <Label htmlFor="type-active" className="mb-0 text-sm">Aktiv</Label>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button type="submit" disabled={submitting || !name.trim() || !categoryId}>
              {submitting ? "Gemmer…" : "Gem"}
            </Button>
            <LinkButton href={`/types/${id}`} variant="secondary">Annuller</LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
