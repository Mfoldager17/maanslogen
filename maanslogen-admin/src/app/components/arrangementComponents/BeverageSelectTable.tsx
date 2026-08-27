"use client";

import { useState, useMemo } from "react";
import { Button } from "@/app/components/ui";

const DEFAULT_PAGE_SIZE = 10;

export type BeverageRow = {
  id: string;
  name: string;
  beverageTypeId?: string;
  brand?: { name: string };
};

type TypeRow = { id: string; name: string; categoryId: string };
type CategoryRow = { id: string; name: string };

type Props = {
  /** Liste af drikkevarer der kan vælges (fx filtreret og uden allerede tilføjede) */
  beverages: BeverageRow[];
  types: TypeRow[];
  categories: CategoryRow[];
  onAdd: (beverageId: string) => void;
  pageSize?: number;
  /** Valgfri id til tabel (accessibility) */
  id?: string;
};

export function BeverageSelectTable({
  beverages,
  types,
  categories,
  onAdd,
  pageSize = DEFAULT_PAGE_SIZE,
  id = "beverage-select-table",
}: Props) {
  const [page, setPage] = useState(0);

  const typeMap = useMemo(() => Object.fromEntries(types.map((t) => [t.id, t.name])), [types]);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const totalPages = Math.max(1, Math.ceil(beverages.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize;
  const pageItems = beverages.slice(start, start + pageSize);

  return (
    <div className="overflow-x-auto rounded border border-border">
      <table id={id} className="w-full min-w-[400px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background-subtle">
            <th scope="col" className="px-3 py-2 font-medium text-foreground-muted">
              Navn
            </th>
            <th scope="col" className="px-3 py-2 font-medium text-foreground-muted">
              Mærke
            </th>
            <th scope="col" className="px-3 py-2 font-medium text-foreground-muted">
              Type
            </th>
            <th scope="col" className="px-3 py-2 font-medium text-foreground-muted">
              Kategori
            </th>
            <th scope="col" className="w-[100px] px-3 py-2 font-medium text-foreground-muted">
              <span className="sr-only">Tilføj</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-foreground-muted">
                {beverages.length === 0 ? "Ingen drikkevarer at vise." : "Ingen matcher på denne side."}
              </td>
            </tr>
          ) : (
            pageItems.map((b) => {
              const typeName = b.beverageTypeId ? typeMap[b.beverageTypeId] ?? "—" : "—";
              const typeRow = types.find((t) => t.id === b.beverageTypeId);
              const categoryName = typeRow?.categoryId ? categoryMap[typeRow.categoryId] ?? "—" : "—";
              return (
                <tr key={b.id} className="border-b border-border/60 last:border-b-0 hover:bg-background-subtle/50">
                  <td className="px-3 py-2 font-medium">{b.name}</td>
                  <td className="px-3 py-2 text-foreground-muted">{b.brand?.name ?? "—"}</td>
                  <td className="px-3 py-2 text-foreground-muted">{typeName}</td>
                  <td className="px-3 py-2 text-foreground-muted">{categoryName}</td>
                  <td className="px-3 py-2">
                    <Button type="button" variant="outline" onClick={() => onAdd(b.id)} className="min-h-0 py-1.5 text-sm">
                      Tilføj
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background-subtle/50 px-3 py-2">
          <span className="text-sm text-foreground-muted">
            Side {safePage + 1} af {totalPages}
            {beverages.length > 0 && (
              <span className="ml-2">
                (viser {start + 1}–{Math.min(start + pageSize, beverages.length)} af {beverages.length})
              </span>
            )}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="min-h-0 py-1.5 text-sm"
            >
              Forrige
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="min-h-0 py-1.5 text-sm"
            >
              Næste
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
