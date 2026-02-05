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
  Alert,
  AccentLink,
  LinkButton,
  StatusDot,
} from "@/app/components/ui";
import { IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useBrands } from "@/lib/hooks";

export function BrandsPageClient() {
  const {
    list,
    categories,
    loading,
    error,
    name,
    setName,
    description,
    setDescription,
    active,
    setActive,
    categoryIds,
    toggleCategoryId,
    submitting,
    handleSubmit,
    handleDelete,
  } = useBrands();

  async function onDelete(id: string, brandName: string) {
    if (!confirm(`Slet mærke "${brandName}"? Kan ikke fortrydes. Mærker med drikkevarer kan ikke slettes.`)) return;
    await handleDelete(id);
  }

  return (
    <div>
      <PageHeading>Mærker</PageHeading>

      <CollapsibleCard title="Opret nyt mærke" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Navn</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="fx Carlsberg"
                />
              </div>
              <div>
                <Label>Beskrivelse</Label>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Valgfri"
                />
              </div>
            </div>

            <div>
              <Label>Tilladte kategorier</Label>
              <p className="text-heading-muted mb-2 text-xs">
                Tom liste = tilladt i alle kategorier. Vælg de kategorier mærket må bruges i.
              </p>
              {categories.length === 0 ? (
                <p className="text-heading-muted text-sm">Ingen kategorier oprettet endnu.</p>
              ) : (
                <ul className="border-theme max-h-48 space-y-1 overflow-auto rounded border p-2">
                  {categories.map((c) => {
                    const checked = categoryIds.includes(c.id);
                    return (
                      <li key={c.id}>
                        <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-[rgb(var(--color-border))]/10">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategoryId(c.id)}
                            className="input-theme h-4 w-4 rounded border-[rgb(var(--color-border))] focus:outline-none focus:ring-0 focus:shadow-none"
                          />
                          <span className="text-sm">{c.name}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="input-theme h-4 w-4 rounded border-[rgb(var(--color-border))] focus:outline-none focus:ring-0 focus:shadow-none"
                />
                <span className="text-sm font-medium">Aktiv</span>
              </label>
              <Button type="submit" disabled={submitting || !name.trim()}>
                {submitting ? "Opretter…" : "Opret"}
              </Button>
            </div>
          </div>
        </form>
      </CollapsibleCard>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section>
        <SectionHeading>Eksisterende mærker</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : list.length === 0 ? (
          <EmptyState>Ingen mærker endnu.</EmptyState>
        ) : (
          <CardList>
            {list.map((b) => (
              <CardListItem key={b.id}>
                <div className="flex items-center gap-2">
                  <StatusDot active={b.active ?? true} />
                  <AccentLink href={`/brands/${encodeURIComponent(b.id ?? "")}`}>
                    {b.name}
                  </AccentLink>
                  {typeof b.description === "string" && b.description && (
                    <span className="text-heading-muted ml-2 text-sm">{b.description}</span>
                  )}
                  {(b as { categoryIds?: string[] }).categoryIds?.length !== undefined && (
                    <span className="text-heading-muted ml-2 text-xs">
                      ({(b as { categoryIds?: string[] }).categoryIds?.length === 0 ? "alle kategorier" : `${(b as { categoryIds?: string[] }).categoryIds?.length} kategorier`})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="danger"
                    iconOnly
                    aria-label="Slet"
                    onClick={() => onDelete(b.id ?? "", b.name ?? "")}
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
