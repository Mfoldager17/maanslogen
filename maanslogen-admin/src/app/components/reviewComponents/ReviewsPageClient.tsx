"use client";

import {
  PageHeading,
  CardList,
  CardListItem,
  Alert,
  AccentLink,
  LinkButton,
  Button,
  FilterBar,
} from "@/app/components/ui";
import { IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useReviews } from "@/lib/hooks";

export function ReviewsPageClient() {
  const {
    list,
    beverages,
    categories,
    loading,
    error,
    categoryId,
    setCategoryId,
    typeId,
    setTypeId,
    beverageId,
    setBeverageId,
    filteredReviews,
    categoryMap,
    typesInCategory,
    beveragesFiltered,
    beverageLabel,
    handleDelete,
  } = useReviews();

  async function onDelete(id: string) {
    if (!confirm("Slet denne anmeldelse? Drikkevarens anmeldelsestælling opdateres.")) return;
    await handleDelete(id);
  }

  return (
    <div>
      <PageHeading>Anmeldelser</PageHeading>
      <p className="text-foreground-muted mb-6 text-sm">
        Du kan slette anmeldelser herunder.
      </p>

      {error && <Alert className="mb-4">{error}</Alert>}

      <FilterBar
        className="mb-6"
        hasActiveFilters={!!categoryId || !!typeId || !!beverageId}
        onClear={() => {
          setCategoryId("");
          setTypeId("");
          setBeverageId("");
        }}
      >
        <FilterBar.Field
          label="Kategori"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setTypeId("");
            setBeverageId("");
          }}
        >
          <option value="">Alle kategorier</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </FilterBar.Field>
        <FilterBar.Field
          label="Type"
          value={typeId}
          onChange={(e) => {
            setTypeId(e.target.value);
            setBeverageId("");
          }}
        >
          <option value="">Alle typer</option>
          {typesInCategory.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {categoryMap[t.categoryId ?? ""] ? ` (${categoryMap[t.categoryId ?? ""]})` : ""}
            </option>
          ))}
        </FilterBar.Field>
        <FilterBar.Field
          label="Drikkevare"
          value={beverageId}
          onChange={(e) => setBeverageId(e.target.value)}
          className="min-w-52"
        >
          <option value="">Alle drikkevarer</option>
          {beveragesFiltered.map((b) => (
            <option key={b.id} value={b.id}>{beverageLabel(b)}</option>
          ))}
        </FilterBar.Field>
      </FilterBar>

      {loading ? (
        <LoadingState />
      ) : filteredReviews.length === 0 ? (
        <EmptyState>
          {list.length === 0 ? "Ingen anmeldelser endnu." : "Ingen anmeldelser for valgte filter."}
        </EmptyState>
      ) : (
        <>
          <p className="text-foreground-muted mb-2 text-sm">
            Viser {filteredReviews.length} anmeldelse{filteredReviews.length !== 1 ? "r" : ""}
          </p>
          <CardList>
            {filteredReviews.map((r) => {
              const beverage = beverages.find((b) => b.id === r.beverageId);
              return (
                <CardListItem key={r.id} className="flex-col items-stretch gap-2 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <AccentLink href={`/reviews/${encodeURIComponent(r.id ?? "")}`}>
                      ★ {typeof r.rating === "number" ? r.rating.toFixed(1) : r.rating}
                      {typeof r.title === "string" && r.title ? ` – ${r.title}` : ""}
                    </AccentLink>
                    {beverage && (
                      <p className="text-foreground-muted mt-1 text-sm">
                        <AccentLink href={`/beverages/${r.beverageId}`} small>
                          {beverageLabel(beverage)}
                        </AccentLink>
                      </p>
                    )}
                    {typeof r.description === "string" && r.description && (
                      <p className="text-foreground-muted mt-1 text-sm">{r.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-foreground-muted text-xs">{r.userId}</span>
                    <Button
                      type="button"
                      variant="danger"
                      iconOnly
                      aria-label="Slet"
                      onClick={() => onDelete(r.id ?? "")}
                    >
                      <IconTrash className="h-5 w-5" />
                    </Button>
                  </div>
                </CardListItem>
              );
            })}
          </CardList>
        </>
      )}
    </div>
  );
}
