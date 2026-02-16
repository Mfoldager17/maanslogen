"use client";

import { useParams, useRouter } from "next/navigation";
import { useArrangementById } from "@/lib/hooks";
import { getAllBeverages, getAllCategories, getAllTypes } from "@/lib/api-client";
import { updateArrangement } from "@/lib/arrangement-api";
import { getApiError } from "@/lib/hooks/useApiError";
import { useEffect, useState, useMemo } from "react";
import { PageHeading, Card, Alert, Button, TextField, SectionHeading, LinkButton } from "@/app/components/ui";
import { BackLink, IconTrash } from "@/app/components/layout";
import { LoadingState } from "@/app/components/data";
import { BeveragePicker } from "./BeveragePicker";

type BeverageItem = { id: string; name: string; beverageTypeId?: string; brand?: { name: string } };

export function ArrangementEditClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

  const { item, loading, error } = useArrangementById(id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [beverageRows, setBeverageRows] = useState<{ beverageId: string; sortOrder: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [beverages, setBeverages] = useState<BeverageItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [types, setTypes] = useState<{ id: string; name: string; categoryId: string }[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description ?? "");
      setBeverageRows((item.beverages ?? []).map((b) => ({ beverageId: b.beverage.id, sortOrder: b.sortOrder })));
    }
  }, [item]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllBeverages(), getAllCategories(), getAllTypes()]).then(([bevRes, catRes, typesRes]) => {
      if (cancelled) return;
      if (!getApiError(bevRes as { error?: unknown })) setBeverages((bevRes.data ?? []) as BeverageItem[]);
      if (!getApiError(catRes as { error?: unknown })) setCategories((catRes.data ?? []) as { id: string; name: string }[]);
      if (!getApiError(typesRes as { error?: unknown })) setTypes((typesRes.data ?? []) as { id: string; name: string; categoryId: string }[]);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredBeverages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return beverages.filter((b) => {
      if (beverageRows.some((r) => r.beverageId === b.id)) return false;
      if (filterCategoryId) {
        const t = types.find((x) => x.id === b.beverageTypeId);
        if (!t || t.categoryId !== filterCategoryId) return false;
      }
      if (filterTypeId && b.beverageTypeId !== filterTypeId) return false;
      if (q) {
        const nameMatch = b.name.toLowerCase().includes(q);
        const brandMatch = b.brand?.name?.toLowerCase().includes(q);
        if (!nameMatch && !brandMatch) return false;
      }
      return true;
    });
  }, [beverages, beverageRows, filterCategoryId, filterTypeId, searchQuery, types]);

  async function refreshBeverages() {
    const res = await getAllBeverages();
    if (!getApiError(res as { error?: unknown })) setBeverages((res.data ?? []) as BeverageItem[]);
  }

  function addBeverageRow(beverageId: string) {
    if (!beverageId) return;
    setBeverageRows((prev) => [...prev, { beverageId, sortOrder: prev.length }]);
  }

  function removeBeverageRow(index: number) {
    setBeverageRows((prev) => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, sortOrder: i })));
  }

  function moveBeverageRow(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= beverageRows.length) return;
    setBeverageRows((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next.map((r, i) => ({ ...r, sortOrder: i }));
    });
  }

  const beverageLabel = (beverageId: string) => {
    const b = beverages.find((x) => x.id === beverageId);
    return b ? `${b.name}${b.brand?.name ? ` (${b.brand.name})` : ""}` : beverageId;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !name.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await updateArrangement(id, {
      name: name.trim(),
      description: description.trim() || undefined,
      beverages: beverageRows.map((r, i) => ({ beverageId: r.beverageId, sortOrder: i })),
    });
    setSubmitting(false);
    const err = res.error?.message ?? null;
    if (err) {
      setSubmitError(err);
      return;
    }
    router.push(`/arrangements/${encodeURIComponent(id)}`);
  }

  if (loading || !id) {
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

  return (
    <div>
      <BackLink href={`/arrangements/${encodeURIComponent(id)}`}>← Tilbage til arrangement</BackLink>
      <PageHeading>Rediger arrangement</PageHeading>
      <form onSubmit={handleSubmit} className="block">
        <Card as="div" className="mb-4 pb-10">
          <div className="space-y-6">
            <TextField label="Navn" value={name} onChange={(e) => setName(e.target.value)} placeholder="fx IPA-smagning" required />
            <TextField label="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Valgfri" />

            <div className="space-y-3 pb-4">
              <SectionHeading>Drikkevarer (rækkefølge)</SectionHeading>
              <p className="text-sm text-foreground-muted">
                Filtrer efter kategori/type eller søg, vælg drikkevare og tilføj – eller opret en ny.
              </p>
              <BeveragePicker
                beverages={beverages}
                beverageRows={beverageRows}
                addBeverageRow={addBeverageRow}
                categories={categories}
                types={types}
                filterCategoryId={filterCategoryId}
                setFilterCategoryId={setFilterCategoryId}
                filterTypeId={filterTypeId}
                setFilterTypeId={setFilterTypeId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredBeverages={filteredBeverages}
                refreshBeverages={refreshBeverages}
              />
              {beverageRows.length > 0 && (
                <ul className="space-y-2 rounded border border-border bg-background-subtle p-3">
                  {beverageRows.map((row, index) => (
                    <li key={`${row.beverageId}-${index}`} className="flex items-center gap-2">
                      <span className="text-foreground-muted w-6 shrink-0 text-sm">{index + 1}.</span>
                      <span className="min-w-0 flex-1 truncate">{beverageLabel(row.beverageId)}</span>
                      <div className="flex shrink-0 gap-1">
                        <Button type="button" variant="outline" disabled={index === 0} onClick={() => moveBeverageRow(index, "up")}>
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={index === beverageRows.length - 1}
                          onClick={() => moveBeverageRow(index, "down")}
                        >
                          ↓
                        </Button>
                        <Button type="button" variant="danger" iconOnly aria-label="Fjern" onClick={() => removeBeverageRow(index)}>
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>

        {submitError && <Alert className="mb-4">{submitError}</Alert>}
        <div className="mt-6 flex min-h-[3rem] items-center gap-3">
          <Button type="submit" disabled={submitting || !name.trim()}>
            {submitting ? "Gemmer…" : "Gem"}
          </Button>
          <LinkButton href={`/arrangements/${encodeURIComponent(id)}`} variant="secondary">
            Annuller
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
