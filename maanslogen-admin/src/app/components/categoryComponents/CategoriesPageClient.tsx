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
import { useCategories } from "@/lib/hooks";

export function CategoriesPageClient() {
  const { list, loading, error, name, setName, description, setDescription, submitting, handleSubmit } = useCategories();

  return (
    <div>
      <PageHeading>Kategorier</PageHeading>

      <CollapsibleCard title="Opret ny kategori" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Navn</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="fx Øl"
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
        <SectionHeading>Eksisterende kategorier</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : list.length === 0 ? (
          <EmptyState>Ingen kategorier endnu.</EmptyState>
        ) : (
          <CardList>
            {list.map((c) => (
              <CardListItem key={c.id}>
                <div>
                  <AccentLink href={`/categories/${encodeURIComponent(c.id ?? "")}`}>
                    {c.name}
                  </AccentLink>
                  {typeof c.description === "string" && c.description && (
                    <span className="text-heading-muted ml-2 text-sm">{c.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <AccentLink href={`/questions?categoryId=${encodeURIComponent(c.id ?? "")}`} small>
                    Tilføj spørgsmål
                  </AccentLink>
                  <span className="text-heading-muted text-xs">{c.id}</span>
                </div>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
