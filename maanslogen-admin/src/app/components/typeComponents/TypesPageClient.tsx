"use client";

import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  CollapsibleCard,
  Button,
  Input,
  Label,
  Select,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useTypes } from "@/lib/hooks";

export function TypesPageClient() {
  const {
    types,
    categories,
    loading,
    error,
    name,
    setName,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    active,
    setActive,
    submitting,
    handleSubmit,
    categoryMap,
  } = useTypes();

  return (
    <div>
      <PageHeading>Beverage-typer</PageHeading>

      <CollapsibleCard title="Opret ny type" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Navn</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="fx IPA" />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
              <Label htmlFor="active" className="mb-0 text-sm">Aktiv</Label>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={submitting || !name.trim() || !categoryId}>
                {submitting ? "Opretter…" : "Opret"}
              </Button>
            </div>
          </div>
        </form>
      </CollapsibleCard>

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
                  <AccentLink href={`/types/${encodeURIComponent(t.id ?? "")}`}>{t.name}</AccentLink>
                  <span className="text-heading-muted ml-2 text-sm">
                    {t.categoryId ? (categoryMap[t.categoryId] ?? t.categoryId) : ""}
                  </span>
                  {typeof t.description === "string" && t.description && (
                    <span className="text-heading-muted ml-2 text-sm">– {t.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <AccentLink
                    href={`/questions?typeId=${encodeURIComponent(t.id ?? "")}${t.categoryId ? `&categoryId=${encodeURIComponent(t.categoryId)}` : ""}`}
                    small
                  >
                    Tilføj spørgsmål
                  </AccentLink>
                  <span className="text-heading-muted text-xs">{t.active ? "Aktiv" : "Inaktiv"}</span>
                </div>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
