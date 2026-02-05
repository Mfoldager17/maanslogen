"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAttributeById,
  getAllCategories,
  getAllTypes,
  updateAttribute,
} from "@/lib/api-client";
import { useFetchAll } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import {
  PageHeading,
  Card,
  Alert,
  LinkButton,
  Button,
  Input,
  Label,
  Select,
} from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { LoadingState } from "@/app/components/data";

export function AttributeEditClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

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
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [typeIds, setTypeIds] = useState<string[]>([]);
  const [attributeKey, setAttributeKey] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [dataType, setDataType] = useState<"string" | "number" | "boolean">("string");
  const [filterable, setFilterable] = useState(false);
  const [required, setRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      const catIds = (item as { categoryIds?: string[] }).categoryIds ?? [];
      const typIds = (item as { typeIds?: string[] }).typeIds ?? [];
      setCategoryIds(catIds);
      setTypeIds(typIds);
      setAttributeKey((item as { attributeKey?: string }).attributeKey ?? "");
      setDisplayName((item as { displayName?: string }).displayName ?? "");
      setDataType(((item as { dataType?: string }).dataType as "string" | "number" | "boolean") ?? "string");
      setFilterable((item as { filterable?: boolean }).filterable ?? false);
      setRequired((item as { required?: boolean }).required ?? false);
    }
  }, [item]);

  function toggleCategoryId(cid: string) {
    setCategoryIds((prev) =>
      prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid],
    );
  }

  function toggleTypeId(tid: string) {
    setTypeIds((prev) =>
      prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid],
    );
  }

  const typesInSelectedCategories =
    categoryIds.length && types
      ? types.filter((t) => t.categoryId && categoryIds.includes(t.categoryId))
      : types ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (categoryIds.length === 0 || !attributeKey.trim() || !displayName.trim() || !dataType) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await updateAttribute({
      path: { id },
      body: {
        categoryIds,
        typeIds: typeIds.length ? typeIds : undefined,
        attributeKey: attributeKey.trim(),
        displayName: displayName.trim(),
        dataType,
        filterable,
        required,
      },
    });
    setSubmitting(false);
    const err = getApiError(res);
    if (err) {
      setSubmitError(err);
      return;
    }
    router.push(`/attributes/${id}`);
  }

  if (loading) {
    return (
      <div>
        <BackLink href={`/attributes/${id}`}>← Tilbage til attribut</BackLink>
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

  return (
    <div>
      <BackLink href={`/attributes/${id}`}>← Tilbage til attribut</BackLink>
      <PageHeading>Rediger attributedefinition</PageHeading>
      {submitError && <Alert className="mb-4">{submitError}</Alert>}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-row flex-wrap items-end gap-4">
          <div className="flex min-w-[200px] flex-1 basis-full flex-col gap-1">
            <Label>Kategorier (vælg mindst én)</Label>
            <div className="flex flex-wrap gap-3">
              {(categories ?? []).map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(c.id)}
                    onChange={() => toggleCategoryId(c.id)}
                    className="input-theme h-4 w-4 rounded border-[rgb(var(--color-border))]"
                  />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex min-w-[200px] flex-1 basis-full flex-col gap-1">
            <Label>Typer (valgfri – tom = alle typer i valgte kategorier)</Label>
            <div className="flex flex-wrap gap-3">
              {typesInSelectedCategories.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={typeIds.includes(t.id)}
                    onChange={() => toggleTypeId(t.id)}
                    className="input-theme h-4 w-4 rounded border-[rgb(var(--color-border))]"
                  />
                  <span className="text-sm">{t.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="attr-key">Attribut-nøgle</Label>
            <Input
              id="attr-key"
              type="text"
              value={attributeKey}
              onChange={(e) => setAttributeKey(e.target.value)}
              placeholder="fx abv"
            />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="attr-display">Visningsnavn</Label>
            <Input
              id="attr-display"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="fx Alkohol %"
            />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col gap-1">
            <Label htmlFor="attr-dtype">Datatype</Label>
            <Select
              id="attr-dtype"
              value={dataType}
              onChange={(e) => setDataType(e.target.value as "string" | "number" | "boolean")}
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filterable}
                onChange={(e) => setFilterable(e.target.checked)}
                className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
              />
              <span className="text-heading-muted text-sm">Filterbar</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
              />
              <span className="text-heading-muted text-sm">Påkrævet</span>
            </label>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button
              type="submit"
              disabled={submitting || categoryIds.length === 0 || !attributeKey.trim() || !displayName.trim()}
            >
              {submitting ? "Gemmer…" : "Gem"}
            </Button>
            <LinkButton href={`/attributes/${id}`} variant="secondary">Annuller</LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
