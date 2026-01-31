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
import { useAttributes } from "@/lib/hooks";

export function AttributesPageClient() {
  const {
    list,
    categories,
    types,
    loading,
    error,
    categoryId,
    setCategoryId,
    typeId,
    setTypeId,
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
    categoryMap,
    typeMap,
    typesInCategory,
  } = useAttributes();

  const typeIdDisplay = (a: { typeId?: unknown }) =>
    typeof a.typeId === "string" ? (typeMap[a.typeId] ?? a.typeId) : "";

  return (
    <div>
      <PageHeading>Attributedefinitioner</PageHeading>

      <CollapsibleCard title="Opret ny attributedefinition" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={categoryId}
              onChange={(e) => {
                const newCategoryId = e.target.value;
                setCategoryId(newCategoryId);
                if (typeId && types.find((t) => t.id === typeId)?.categoryId !== newCategoryId) setTypeId("");
              }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type (valgfri)</Label>
            <Select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
              <option value="">Alle typer i kategorien</option>
              {typesInCategory.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
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
                className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
              />
              <span className="text-heading-muted text-sm">Filterbar</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
              />
              <span className="text-heading-muted text-sm">Påkrævet</span>
            </label>
          </div>
          <div className="flex w-full items-end sm:w-auto">
            <Button
              type="submit"
              disabled={submitting || !categoryId || !attributeKey.trim() || !displayName.trim()}
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
                  <span className="text-heading-muted ml-2 text-sm">
                    ({a.attributeKey}, {a.dataType})
                  </span>
                  <span className="text-heading-muted ml-2 text-sm">
                    {a.categoryId ? (categoryMap[a.categoryId] ?? a.categoryId) : ""}
                    {typeIdDisplay(a) ? ` / ${typeIdDisplay(a)}` : ""}
                  </span>
                </div>
                <span className="text-heading-muted text-xs">
                  {a.filterable ? "Filterbar" : ""} {a.required ? "Påkrævet" : ""}
                </span>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
