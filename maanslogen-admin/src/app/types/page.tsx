"use client";

import { useEffect, useState } from "react";
import {
  getAllTypes,
  getAllCategories,
  createType,
  type BeverageCategory,
  type BeverageType,
} from "@/lib/api-client";
import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  Button,
  Input,
  Label,
  Select,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";

export default function TypesPage() {
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const [typesRes, categoriesRes] = await Promise.all([
      getAllTypes(),
      getAllCategories(),
    ]);
    const typesErr = (typesRes as { error?: { message?: string } }).error;
    if (typesErr) setError(typesErr.message || "Kunne ikke hente typer");
    else setTypes(typesRes.data ?? []);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    const firstCatId = categoriesRes.data?.[0]?.id;
    if (!categoryId && firstCatId) setCategoryId(firstCatId);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const firstId = categories[0]?.id;
    if (categories.length && !categoryId && firstId) setCategoryId(firstId);
  }, [categories, categoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createType({
      body: { name: name.trim(), categoryId, description: description.trim() || undefined, active },
    });
    setSubmitting(false);
    const createErr = (createRes as { error?: { message?: string } }).error;
    if (createErr) {
      setError(createErr.message || "Kunne ikke oprette type");
      return;
    }
    setName("");
    setDescription("");
    if (createRes.data) setTypes((prev) => [...prev, createRes.data]);
  }

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeading>Beverage-typer</PageHeading>

      <Card as="form" onSubmit={handleSubmit} className="mb-8">
        <SectionHeading className="mb-4">Opret ny type</SectionHeading>
        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Navn</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="fx IPA"
            />
          </div>
          <div>
            <Label>Kategori</Label>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[200px] flex-1">
            <Label>Beskrivelse</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valgfri"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
            />
            <Label htmlFor="active" className="mb-0 text-sm">
              Aktiv
            </Label>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={submitting || !name.trim() || !categoryId}>
              {submitting ? "Opretter…" : "Opret"}
            </Button>
          </div>
        </div>
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section>
        <SectionHeading>Eksisterende typer</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : types.length === 0 ? (
          <EmptyState>Ingen typer endnu.</EmptyState>
        ) : (
          <CardList>
            {types.map((t) => (
              <CardListItem key={t.id}>
                <div>
                  <AccentLink href={`/types/${encodeURIComponent(t.id ?? "")}`}>
                    {t.name}
                  </AccentLink>
                  <span className="text-heading-muted ml-2 text-sm">
                    {t.categoryId ? (categoryMap[t.categoryId] ?? t.categoryId) : ""}
                  </span>
                  {t.description && (
                    <span className="text-heading-muted ml-2 text-sm">
                      – {t.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <AccentLink
                    href={`/questions?typeId=${encodeURIComponent(t.id ?? "")}${t.categoryId ? `&categoryId=${encodeURIComponent(t.categoryId)}` : ""}`}
                    small
                  >
                    Tilføj spørgsmål
                  </AccentLink>
                  <span className="text-heading-muted text-xs">
                    {t.active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
