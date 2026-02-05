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
} from "@/app/components/ui";
import { IconPencil, IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useCategories } from "@/lib/hooks";

export function CategoriesPageClient() {
  const { list, loading, error, name, setName, description, setDescription, submitting, handleSubmit, handleDelete } = useCategories();

  async function onDelete(id: string, categoryName: string) {
    if (!confirm(`Slet kategori "${categoryName}"? Kategorier med typer eller mærker kan ikke slettes.`)) return;
    await handleDelete(id);
  }

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
            {list.map((c) => {
              const iconImage = c.images?.find((img) => img.type === "ICON") ?? c.images?.[0];
              // ICON type: url is often the icon itself (e.g. emoji), not a link. Only use img for real URLs.
              const isImageUrl = iconImage?.url && (iconImage.url.startsWith("http") || iconImage.url.startsWith("/"));
              return (
              <CardListItem key={c.id}>
                <div className="flex items-center gap-3">
                  {isImageUrl ? (
                    <img
                      src={iconImage!.url}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded object-cover"
                    />
                  ) : iconImage?.url ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-xl leading-none" aria-hidden>
                      {iconImage.url}
                    </span>
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-background-hover text-foreground-muted" aria-hidden>
                      —
                    </span>
                  )}
                  <div>
                    <AccentLink href={`/categories/${encodeURIComponent(c.id ?? "")}`}>
                      {c.name}
                    </AccentLink>
                    {typeof c.description === "string" && c.description && (
                      <span className="text-foreground-muted ml-2 text-sm">{c.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <LinkButton href={`/categories/${encodeURIComponent(c.id ?? "")}/edit`} variant="secondary" iconOnly aria-label="Rediger">
                    <IconPencil className="h-5 w-5" />
                  </LinkButton>
                  <LinkButton href={`/questions?categoryId=${encodeURIComponent(c.id ?? "")}`} variant="secondary">
                    Tilføj spørgsmål
                  </LinkButton>
                  <Button
                    type="button"
                    variant="danger"
                    iconOnly
                    aria-label="Slet"
                    onClick={() => onDelete(c.id ?? "", c.name ?? "")}
                  >
                    <IconTrash className="h-5 w-5" />
                  </Button>
                </div>
              </CardListItem>
              );
            })}
          </CardList>
        )}
      </section>
    </div>
  );
}
