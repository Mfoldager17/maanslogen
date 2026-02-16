"use client";

import { useState } from "react";
import { Button, TextField, SelectField, CollapsibleCard } from "@/app/components/ui";
import { BeverageCreateForm } from "@/app/components/beverageComponents/BeverageCreateForm";
import { BeverageSelectTable } from "./BeverageSelectTable";

type BeverageItem = { id: string; name: string; beverageTypeId?: string; brand?: { name: string } };
type Category = { id: string; name: string };
type Type = { id: string; name: string; categoryId: string };

type Props = {
  beverages: BeverageItem[];
  beverageRows: { beverageId: string; sortOrder: number }[];
  addBeverageRow: (beverageId: string) => void;
  categories: Category[];
  types: Type[];
  filterCategoryId: string;
  setFilterCategoryId: (v: string) => void;
  filterTypeId: string;
  setFilterTypeId: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredBeverages: BeverageItem[];
  refreshBeverages: () => Promise<void>;
};

export function BeveragePicker({
  beverages,
  addBeverageRow,
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
}: Props) {
  const [showCreate, setShowCreate] = useState(false);

  async function onBeverageCreated(created: { id: string }) {
    addBeverageRow(created.id);
    await refreshBeverages();
    setShowCreate(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <SelectField
          label="Kategori"
          value={filterCategoryId}
          onChange={(e) => { setFilterCategoryId(e.target.value); setFilterTypeId(""); }}
          id="bp-filter-cat"
          className="min-w-[140px]"
        >
          <option value="">Alle</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </SelectField>
        <SelectField
          label="Type"
          value={filterTypeId}
          onChange={(e) => setFilterTypeId(e.target.value)}
          id="bp-filter-type"
          className="min-w-[140px]"
          disabled={!filterCategoryId}
        >
          <option value="">Alle</option>
          {filterCategoryId && types.filter((t) => t.categoryId === filterCategoryId).map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </SelectField>
        <TextField
          label="Søg (navn / mærke)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Fx IPA, Carlsberg"
          className="min-w-[180px]"
          id="bp-search"
        />
      </div>

      <BeverageSelectTable
        id="arr-beverage-table"
        beverages={filteredBeverages}
        types={types}
        categories={categories}
        onAdd={addBeverageRow}
        pageSize={10}
      />

      <div>
        <Button type="button" variant="outline" onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? "Luk" : "Opret ny drikkevare"}
        </Button>
      </div>

      {showCreate && (
        <CollapsibleCard title="Opret ny drikkevare og tilføj" defaultOpen={true} className="border border-border-default rounded p-4 bg-background-subtle">
          <BeverageCreateForm
            categories={categories}
            types={types}
            onSuccess={onBeverageCreated}
            noForm
          />
        </CollapsibleCard>
      )}
    </div>
  );
}
