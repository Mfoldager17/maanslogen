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
  LinkButton,
} from "@/app/components/ui";
import { IconPencil, IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useAttributes } from "@/lib/hooks";

export function AttributesPageClient() {
  const {
    list,
    categories,
    types,
    loading,
    error,
    categoryIds,
    toggleCategoryId,
    typeIds,
    toggleTypeId,
    attributeKey,
    setAttributeKey,
    displayName,
    setDisplayName,
    dataType,
    setDataType,
    filterable,
    setFilterable,
    required,
    setRequired,
    submitting,
    handleSubmit,
    handleDelete,
    categoryMap,
    typeMap,
    typesInSelectedCategories,
  } = useAttributes();

  async function onDelete(id: string, displayName: string) {
    if (!confirm(`Slet attributedefinition "${displayName}"? Dette sletter også alle tilknyttede attributværdier.`)) return;
    await handleDelete(id);
  }

  const categoryLabels = (a: { categoryIds?: string[]; categoryId?: string }) =>
    (a.categoryIds ?? (a.categoryId ? [a.categoryId] : []))
      .map((id) => categoryMap[id] ?? id)
      .join(", ");
  const typeLabels = (a: { typeIds?: string[]; typeId?: unknown }) =>
    (a.typeIds ?? (typeof a.typeId === "string" ? [a.typeId] : []))
      .map((id) => typeMap[id] ?? id)
      .join(", ");

  return (
    <div>
      <PageHeading>Attributedefinitioner</PageHeading>

      <CollapsibleCard title="Opret ny attributedefinition" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
          <div className="w-full">
            <Label>Kategorier (vælg mindst én)</Label>
            <div className="mt-1 flex flex-wrap gap-3">
              {categories.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(c.id)}
                    onChange={() => toggleCategoryId(c.id)}
                    className="h-4 w-4 rounded border border-border"
                  />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="w-full">
            <Label>Typer (valgfri – tom = alle typer i valgte kategorier)</Label>
            <div className="mt-1 flex flex-wrap gap-3">
              {typesInSelectedCategories.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={typeIds.includes(t.id)}
                    onChange={() => toggleTypeId(t.id)}
                    className="h-4 w-4 rounded border border-border"
                  />
                  <span className="text-sm">{t.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Attribut-nøgle</Label>
            <Input
              type="text"
              value={attributeKey}
              onChange={(e) => setAttributeKey(e.target.value)}
              placeholder="fx abv"
            />
          </div>
          <div>
            <Label>Visningsnavn</Label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="fx Alkohol %"
            />
          </div>
          <div>
            <Label>Datatype</Label>
            <Select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as "string" | "number" | "boolean")}
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterable}
                onChange={(e) => setFilterable(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-foreground-muted text-sm">Filterbar</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-foreground-muted text-sm">Påkrævet</span>
            </label>
          </div>
          <div className="flex w-full items-end sm:w-auto">
            <Button
              type="submit"
              disabled={submitting || categoryIds.length === 0 || !attributeKey.trim() || !displayName.trim()}
            >
              {submitting ? "Opretter…" : "Opret"}
            </Button>
          </div>
          </div>
        </form>
      </CollapsibleCard>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section>
        <SectionHeading>Eksisterende attributedefinitioner</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : list.length === 0 ? (
          <EmptyState>Ingen attributedefinitioner endnu.</EmptyState>
        ) : (
          <CardList>
            {list.map((a) => (
              <CardListItem key={a.id}>
                <div>
                  <AccentLink href={`/attributes/${encodeURIComponent(a.id ?? "")}`}>
                    {a.displayName}
                  </AccentLink>
                  <span className="text-foreground-muted ml-2 text-sm">
                    ({a.attributeKey}, {a.dataType})
                  </span>
                  <span className="text-foreground-muted ml-2 text-sm">
                    {categoryLabels(a)}
                    {typeLabels(a) ? ` / ${typeLabels(a)}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkButton href={`/attributes/${encodeURIComponent(a.id ?? "")}/edit`} variant="secondary" iconOnly aria-label="Rediger">
                    <IconPencil className="h-5 w-5" />
                  </LinkButton>
                  <Button
                    type="button"
                    variant="danger"
                    iconOnly
                    aria-label="Slet"
                    onClick={() => onDelete(a.id ?? "", a.displayName ?? a.attributeKey ?? "")}
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
