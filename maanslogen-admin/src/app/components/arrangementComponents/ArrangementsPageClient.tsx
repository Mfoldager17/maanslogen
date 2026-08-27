"use client";

import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  Button,
  TextField,
  Alert,
  AccentLink,
  LinkButton,
  SelectField,
} from "@/app/components/ui";
import { IconPencil, IconTrash, IconQueueList } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useArrangements } from "@/lib/hooks";
import { BeveragePicker } from "./BeveragePicker";

export function ArrangementsPageClient() {
  const {
    list,
    loading,
    error,
    name,
    setName,
    description,
    setDescription,
    createdById,
    setCreatedById,
    beverageRows,
    addBeverageRow,
    removeBeverageRow,
    moveBeverageRow,
    users,
    beverages,
    categories,
    types,
    filterCategoryId,
    setFilterCategoryId,
    filterTypeId,
    setFilterTypeId,
    searchQuery,
    setSearchQuery,
    filteredBeverages,
    refreshBeverages,
    submitting,
    handleSubmit,
    handleDelete,
  } = useArrangements();

  async function onDelete(id: string, arrangementName: string) {
    if (!confirm(`Slet arrangement "${arrangementName}"? Dette sletter ikke anmeldelser af de enkelte drikkevarer.`)) return;
    await handleDelete(id);
  }

  const beverageLabel = (beverageId: string) => {
    const b = beverages.find((x) => x.id === beverageId);
    return b ? `${b.name}${b.brand?.name ? ` (${b.brand.name})` : ""}` : beverageId;
  };

  return (
    <div>
      <PageHeading>Arrangementer</PageHeading>
      <form onSubmit={handleSubmit} className="block">
        <Card as="div" className="pb-0">
          <SectionHeading className="mt-0">Opret nyt arrangement (smagning)</SectionHeading>
          <div className="mt-6 space-y-6">
            <TextField
              label="Navn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="fx IPA-smagning"
              required
            />
            <TextField
              label="Beskrivelse"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valgfri"
            />
            <SelectField
              label="Oprettet af (bruger)"
              value={createdById}
              onChange={(e) => setCreatedById(e.target.value)}
              id="arr-createdBy"
            >
              <option value="">Vælg bruger</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="mt-8 space-y-3 pb-4">
            <SectionHeading>Drikkevarer (rækkefølge)</SectionHeading>
            <p className="text-sm text-foreground-muted">
              Filtrer efter kategori/type eller søg, vælg drikkevare og tilføj – eller opret en ny.
            </p>
            <BeveragePicker
              beverages={beverages}
              beverageRows={beverageRows}
              addBeverageRow={addBeverageRow}
              categories={categories}
              types={types}
              filterCategoryId={filterCategoryId}
              setFilterCategoryId={setFilterCategoryId}
              filterTypeId={filterTypeId}
              setFilterTypeId={setFilterTypeId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredBeverages={filteredBeverages}
              refreshBeverages={refreshBeverages}
            />
            {beverageRows.length > 0 && (
              <ul className="mt-3 space-y-2 rounded border border-border bg-background-subtle p-3">
                {beverageRows.map((row, index) => (
                  <li key={`${row.beverageId}-${index}`} className="flex items-center gap-2">
                    <span className="text-foreground-muted w-6 shrink-0 text-sm">{index + 1}.</span>
                    <span className="min-w-0 flex-1 truncate">{beverageLabel(row.beverageId)}</span>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        iconOnly
                        aria-label="Flyt op"
                        disabled={index === 0}
                        onClick={() => moveBeverageRow(index, "up")}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        iconOnly
                        aria-label="Flyt ned"
                        disabled={index === beverageRows.length - 1}
                        onClick={() => moveBeverageRow(index, "down")}
                      >
                        ↓
                      </Button>
                      <Button type="button" variant="danger" iconOnly aria-label="Fjern" onClick={() => removeBeverageRow(index)}>
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <div className="mt-6 mb-8 block min-h-[3rem]">
          <Button type="submit" disabled={submitting || !name.trim() || !createdById}>
            {submitting ? "Opretter…" : "Opret arrangement"}
          </Button>
        </div>
      </form>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section>
        <SectionHeading>Eksisterende arrangementer</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : list.length === 0 ? (
          <EmptyState>Ingen arrangementer endnu. Opret et smagning ovenfor.</EmptyState>
        ) : (
          <CardList>
            {list.map((a) => (
              <CardListItem key={a.id}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-background-hover text-foreground-muted" aria-hidden>
                    <IconQueueList className="h-5 w-5" />
                  </span>
                  <div>
                    <AccentLink href={`/arrangements/${encodeURIComponent(a.id)}`}>{a.name}</AccentLink>
                    {a.description && <span className="ml-2 text-sm text-foreground-muted">{a.description}</span>}
                    {a.beverages && a.beverages.length > 0 && (
                      <span className="ml-2 text-sm text-foreground-muted">({a.beverages.length} drikkevarer)</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LinkButton href={`/arrangements/${encodeURIComponent(a.id)}/edit`} variant="secondary" iconOnly aria-label="Rediger">
                    <IconPencil className="h-5 w-5" />
                  </LinkButton>
                  <Button type="button" variant="danger" iconOnly aria-label="Slet" onClick={() => onDelete(a.id, a.name)}>
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
