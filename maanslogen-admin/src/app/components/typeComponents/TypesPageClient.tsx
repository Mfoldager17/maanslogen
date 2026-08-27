"use client";

import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  CollapsibleCard,
  Button,
  TextField,
  SelectField,
  Label,
  Alert,
  AccentLink,
  LinkButton,
  StatusDot,
} from "@/app/components/ui";
import { IconPencil, IconTrash } from "@/app/components/layout";
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
    handleDelete,
    categoryMap,
  } = useTypes();

  async function onDelete(id: string, typeName: string) {
    if (!confirm(`Slet type "${typeName}"? Typer med drikkevarer kan ikke slettes.`)) return;
    await handleDelete(id);
  }

  return (
    <div>
      <PageHeading>Beverage-typer</PageHeading>

      <CollapsibleCard title="Opret ny type" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-4">
            <TextField
              label="Navn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="fx IPA"
            />
            <SelectField
              label="Kategori"
              id="type-cat"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </SelectField>
            <TextField
              label="Beskrivelse"
              className="min-w-[200px] flex-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valgfri"
            />
            <div className="flex items-center gap-2 pt-[1.5rem] pb-6">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <Label htmlFor="active" className="mb-0 text-sm">Aktiv</Label>
            </div>
            <div className="pt-[1.5rem] pb-6">
              <Button type="submit" className="h-11" disabled={submitting || !name.trim() || !categoryId}>
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
                <div className="flex items-center gap-2">
                  <StatusDot active={t.active ?? true} />
                  <AccentLink href={`/types/${encodeURIComponent(t.id ?? "")}`}>{t.name}</AccentLink>
                  <span className="text-foreground-muted ml-2 text-sm">
                    {t.categoryId ? (categoryMap[t.categoryId] ?? t.categoryId) : ""}
                  </span>
                  {typeof t.description === "string" && t.description && (
                    <span className="text-foreground-muted ml-2 text-sm">– {t.description}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <LinkButton href={`/types/${encodeURIComponent(t.id ?? "")}/edit`} variant="secondary" iconOnly aria-label="Rediger">
                    <IconPencil className="h-5 w-5" />
                  </LinkButton>
                  <LinkButton
                    href={`/questions?typeId=${encodeURIComponent(t.id ?? "")}${t.categoryId ? `&categoryId=${encodeURIComponent(t.categoryId)}` : ""}`}
                    variant="secondary"
                  >
                    Tilføj spørgsmål
                  </LinkButton>
                  <Button
                    type="button"
                    variant="danger"
                    iconOnly
                    aria-label="Slet"
                    onClick={() => onDelete(t.id ?? "", t.name ?? "")}
                  >
                    <IconTrash className="h-5 w-5" />
                  </Button>
                </div>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
