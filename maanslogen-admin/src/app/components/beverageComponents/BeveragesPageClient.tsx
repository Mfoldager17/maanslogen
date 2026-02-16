"use client";

import {
  PageHeading,
  SectionHeading,
  CardList,
  CardListItem,
  CollapsibleCard,
  Button,
  Alert,
  AccentLink,
  LinkButton,
  FilterBar,
} from "@/app/components/ui";
import { IconPencil, IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useBeverages } from "@/lib/hooks";
import { BeverageCreateForm } from "./BeverageCreateForm";
import { Beverage } from "@/lib/api-client";

export function BeveragesPageClient() {
  const {
    list,
    types,
    categories,
    loading,
    error,
    filterCategoryId,
    setFilterCategoryId,
    filterTypeId,
    setFilterTypeId,
    typeMap,
    categoryMap,
    typesInFilterCategory,
    filteredList,
    addBeverageToList,
    handleDelete,
    beverageBrandName,
  } = useBeverages();

  async function onDelete(id: string, label: string) {
    if (!confirm(`Slet drikkevare "${label}"? Dette sletter også anmeldelser og attributværdier.`)) return;
    await handleDelete(id);
  }

  return (
    <div>
      <PageHeading>Drikke</PageHeading>

      <CollapsibleCard title="Opret ny drikke" defaultOpen={false} className="mb-8">
        <BeverageCreateForm
          categories={categories}
          types={types}
          onSuccess={(created) => addBeverageToList(created as Beverage)}
        />
      </CollapsibleCard>

      {error && <Alert className="mb-4">{error}</Alert>}

      <FilterBar
        className="mb-6"
        hasActiveFilters={!!filterCategoryId || !!filterTypeId}
        onClear={() => {
          setFilterCategoryId("");
          setFilterTypeId("");
        }}
      >
        <FilterBar.Field
          label="Kategori"
          value={filterCategoryId}
          onChange={(e) => {
            setFilterCategoryId(e.target.value);
            setFilterTypeId("");
          }}
        >
          <option value="">Alle kategorier</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </FilterBar.Field>
        <FilterBar.Field
          label="Type"
          value={filterTypeId}
          onChange={(e) => setFilterTypeId(e.target.value)}
        >
          <option value="">Alle typer</option>
          {typesInFilterCategory.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {categoryMap[t.categoryId ?? ""] ? ` (${categoryMap[t.categoryId ?? ""]})` : ""}
            </option>
          ))}
        </FilterBar.Field>
      </FilterBar>

      <section>
        <SectionHeading>Eksisterende drikke</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : filteredList.length === 0 ? (
          <EmptyState>
            {list.length === 0 ? "Ingen drikke endnu." : "Ingen drikke for valgte filter."}
          </EmptyState>
        ) : (
          <>
            <p className="text-foreground-muted mb-2 text-sm">
              Viser {filteredList.length} drikke{filteredList.length !== 1 ? "varer" : "vare"}
            </p>
            <CardList>
              {filteredList.map((b) => (
                <CardListItem key={b.id}>
                  <div>
                    <AccentLink href={`/beverages/${encodeURIComponent(b.id ?? "")}`}>
                      {beverageBrandName(b)} – {b.name}
                    </AccentLink>
                    <span className="text-foreground-muted ml-2 text-sm">
                      {b.beverageTypeId ? (typeMap[b.beverageTypeId] ?? b.beverageTypeId) : ""}
                    </span>
                    {b.country && (
                      <span className="text-foreground-muted ml-2 text-sm">({b.country})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-foreground-muted text-xs">
                      {b.averageRating != null ? `★ ${b.averageRating.toFixed(1)}` : ""}{" "}
                      {b.reviewCount != null ? `(${b.reviewCount})` : ""}
                    </span>
                    <LinkButton
                      href={`/beverages/${encodeURIComponent(b.id ?? "")}/edit`}
                      variant="secondary"
                      iconOnly
                      aria-label="Rediger"
                    >
                      <IconPencil className="h-5 w-5" />
                    </LinkButton>
                    <Button
                      type="button"
                      variant="danger"
                      iconOnly
                      aria-label="Slet"
                      onClick={() => onDelete(b.id ?? "", `${beverageBrandName(b)} – ${b.name ?? ""}`)}
                    >
                      <IconTrash className="h-5 w-5" />
                    </Button>
                  </div>
                </CardListItem>
              ))}
            </CardList>
          </>
        )}
      </section>
    </div>
  );
}
