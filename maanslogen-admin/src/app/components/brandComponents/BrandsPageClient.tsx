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
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useBrands } from "@/lib/hooks";

export function BrandsPageClient() {
  const {
    list,
    loading,
    error,
    name,
    setName,
    description,
    setDescription,
    active,
    setActive,
    submitting,
    handleSubmit,
  } = useBrands();

  return (
    <div>
      <PageHeading>Mærker</PageHeading>

      <CollapsibleCard title="Opret nyt mærke" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Navn</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="fx Carlsberg"
              />
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
                <div>
                  <AccentLink href={`/brands/${encodeURIComponent(b.id ?? "")}`}>
                    {b.name}
                  </AccentLink>
                  {typeof b.description === "string" && b.description && (
                    <span className="text-heading-muted ml-2 text-sm">{b.description}</span>
                  )}
                </div>
                <span className="text-heading-muted text-xs">
                  {b.active ? "Aktiv" : "Inaktiv"}
                </span>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
