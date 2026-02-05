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
import { IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useBeverages } from "@/lib/hooks";

export function BeveragesPageClient() {
  const {
    list,
    types,
    categories,
    brands,
    loading,
    error,
    filterCategoryId,
    setFilterCategoryId,
    filterTypeId,
    setFilterTypeId,
    createCategoryId,
    setCreateCategoryId,
    typesInCreateCategory,
    beverageTypeId,
    setBeverageTypeId,
    brandsInCreateCategory,
    showBrandsFilteredHint,
    brandId,
    setBrandId,
    name,
    setName,
    country,
    setCountry,
    imageFile,
    setImageFile,
    submitting,
    imageInputRef,
    attributeDefinitions,
    attributeValues,
    setAttributeValue,
    typeMap,
    categoryMap,
    typesInFilterCategory,
    filteredList,
    handleSubmit,
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={createCategoryId}
              onChange={(e) => setCreateCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={beverageTypeId}
              onChange={(e) => setBeverageTypeId(e.target.value)}
              disabled={!createCategoryId || typesInCreateCategory.length === 0}
            >
              <option value="">
                {createCategoryId
                  ? typesInCreateCategory.length === 0
                    ? "Ingen typer i kategorien"
                    : "Vælg type"
                  : "Vælg kategori først"}
              </option>
              {typesInCreateCategory.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Mærke</Label>
            <Select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              disabled={!createCategoryId}
            >
              <option value="">
                {createCategoryId
                  ? brandsInCreateCategory.length === 0
                    ? "Ingen mærker tilladt i denne kategori"
                    : "Vælg mærke"
                  : "Vælg kategori først"}
              </option>
              {brandsInCreateCategory.map((br) => (
                <option key={br.id} value={br.id}>{br.name}</option>
              ))}
            </Select>
            {showBrandsFilteredHint && (
              <p className="text-heading-muted mt-1 text-xs">
                Viser kun mærker tilladt i denne kategori
              </p>
            )}
          </div>
          <div>
            <Label>Navn</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="fx Pilsner"
            />
          </div>
          <div>
            <Label>Land</Label>
            <Input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="fx DK"
            />
          </div>
          {attributeDefinitions.map((def) => (
            <div key={def.id}>
              {def.dataType === "boolean" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`attr-${def.id}`}
                    checked={(attributeValues[def.id] as boolean | undefined) ?? false}
                    onChange={(e) => setAttributeValue(def.id, e.target.checked)}
                    className="input-theme h-4 w-4 rounded border-[rgb(var(--color-border))]"
                  />
                  <Label htmlFor={`attr-${def.id}`} className="mb-0!">
                    {def.displayName}
                    {def.required && <span className="text-red-500"> *</span>}
                  </Label>
                </div>
              ) : (
                <>
                  <Label htmlFor={`attr-${def.id}`}>
                    {def.displayName}
                    {def.required && <span className="text-red-500"> *</span>}
                  </Label>
                  <Input
                    id={`attr-${def.id}`}
                    type={def.dataType === "number" ? "number" : "text"}
                    value={String((attributeValues[def.id] as string | number | undefined) ?? "")}
                    onChange={(e) => {
                      if (def.dataType === "number") {
                        const v = e.target.value;
                        setAttributeValue(def.id, v === "" ? undefined : Number(v));
                      } else {
                        setAttributeValue(def.id, e.target.value);
                      }
                    }}
                    placeholder={def.required ? "Påkrævet" : "Valgfrit"}
                  />
                </>
              )}
            </div>
          ))}
          <div>
            <Label>Billede (valgfrit)</Label>
            <Input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
            {imageFile && (
              <span className="text-heading-muted ml-2 text-xs">{imageFile.name}</span>
            )}
            <p className="text-heading-muted mt-1 text-xs">
              Ét billede – skaleres automatisk til thumbnail (200×200) og stor version (800×800). JPEG, PNG, WebP eller GIF.
            </p>
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={submitting || !brandId || !name.trim() || !beverageTypeId}
            >
              {submitting ? "Opretter…" : "Opret"}
            </Button>
          </div>
        </div>
        </form>
      </CollapsibleCard>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section className="mb-6">
        <SectionHeading className="mb-3">Filtre</SectionHeading>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={filterCategoryId}
              onChange={(e) => {
                setFilterCategoryId(e.target.value);
                setFilterTypeId("");
              }}
              className="text-sm"
            >
              <option value="">Alle kategorier</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={filterTypeId}
              onChange={(e) => setFilterTypeId(e.target.value)}
              className="text-sm"
            >
              <option value="">Alle typer</option>
              {typesInFilterCategory.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {categoryMap[t.categoryId ?? ""] ? ` (${categoryMap[t.categoryId ?? ""]})` : ""}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

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
            <p className="text-heading-muted mb-2 text-sm">
              Viser {filteredList.length} drikke{filteredList.length !== 1 ? "varer" : "vare"}
            </p>
            <CardList>
              {filteredList.map((b) => (
                <CardListItem key={b.id}>
                  <div>
                    <AccentLink href={`/beverages/${encodeURIComponent(b.id ?? "")}`}>
                      {beverageBrandName(b)} – {b.name}
                    </AccentLink>
                    <span className="text-heading-muted ml-2 text-sm">
                      {b.beverageTypeId ? (typeMap[b.beverageTypeId] ?? b.beverageTypeId) : ""}
                    </span>
                    {b.country && (
                      <span className="text-heading-muted ml-2 text-sm">({b.country})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-heading-muted text-xs">
                      {b.averageRating != null ? `★ ${b.averageRating.toFixed(1)}` : ""}{" "}
                      {b.reviewCount != null ? `(${b.reviewCount})` : ""}
                    </span>
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
