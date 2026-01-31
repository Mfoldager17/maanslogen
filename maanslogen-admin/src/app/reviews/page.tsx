"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllReviews,
  getAllBeverages,
  getAllTypes,
  getAllCategories,
  type Review,
  type Beverage,
  type BeverageType,
  type BeverageCategory,
} from "@/lib/api-client";
import {
  PageHeading,
  SectionHeading,
  CardList,
  CardListItem,
  Label,
  Select,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";

export default function ReviewsPage() {
  const [list, setList] = useState<Review[]>([]);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [beverageId, setBeverageId] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getAllReviews(),
      getAllBeverages(),
      getAllTypes(),
      getAllCategories(),
    ])
      .then(([reviewsRes, bevRes, typesRes, catRes]) => {
        if (cancelled) return;
        const err = (reviewsRes as { error?: { message?: string } }).error;
        if (err) {
          setError(err.message || "Kunne ikke hente anmeldelser");
          setList([]);
        } else {
          setList(reviewsRes.data ?? []);
        }
        if (bevRes.data) setBeverages(bevRes.data);
        if (typesRes.data) setTypes(typesRes.data);
        if (catRes.data) setCategories(catRes.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const typeMap = useMemo(() => Object.fromEntries(types.map((t) => [t.id, t])), [types]);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const filteredReviews = useMemo(() => {
    if (!beverageId && !typeId && !categoryId) return list;
    return list.filter((r) => {
      const beverage = beverages.find((b) => b.id === r.beverageId);
      if (!beverage) return false;
      if (beverageId && r.beverageId !== beverageId) return false;
      const type = beverage.beverageTypeId ? typeMap[beverage.beverageTypeId] : null;
      if (typeId && beverage.beverageTypeId !== typeId) return false;
      if (categoryId && type?.categoryId !== categoryId) return false;
      return true;
    });
  }, [list, beverages, typeMap, categoryId, typeId, beverageId]);

  const typesInCategory = useMemo(
    () => (categoryId ? types.filter((t) => t.categoryId === categoryId) : types),
    [types, categoryId],
  );
  const beveragesFiltered = useMemo(() => {
    let list: Beverage[];
    if (typeId) list = beverages.filter((b) => b.beverageTypeId === typeId);
    else if (categoryId) {
      const typeIdsInCat = new Set(types.filter((t) => t.categoryId === categoryId).map((t) => t.id));
      list = beverages.filter((b) => b.beverageTypeId && typeIdsInCat.has(b.beverageTypeId));
    } else list = beverages;
    if (beverageId) {
      const selected = beverages.find((b) => b.id === beverageId);
      if (selected && !list.some((b) => b.id === beverageId)) list = [selected, ...list];
    }
    return list;
  }, [beverages, categoryId, typeId, beverageId, types]);

  const beverageLabel = (b: Beverage) => {
    const t = b.beverageTypeId ? typeMap[b.beverageTypeId] : null;
    const typeName = t?.name ?? b.beverageTypeId;
    return `${b.brand ?? ""} – ${b.name ?? ""}${typeName ? ` (${typeName})` : ""}`;
  };

  return (
    <div>
      <PageHeading>Anmeldelser</PageHeading>
      <p className="text-heading-muted mb-6 text-sm">
        Kun visning. Oprettelse og redigering sker via bruger-/drikke-flow.
      </p>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section className="mb-6">
        <SectionHeading className="mb-3">Filtre</SectionHeading>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setTypeId("");
                setBeverageId("");
              }}
              className="text-sm"
            >
              <option value="">Alle kategorier</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={typeId}
              onChange={(e) => {
                setTypeId(e.target.value);
                setBeverageId("");
              }}
              className="text-sm"
            >
              <option value="">Alle typer</option>
              {typesInCategory.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {categoryMap[t.categoryId ?? ""] ? ` (${categoryMap[t.categoryId ?? ""]})` : ""}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Drikkevare</Label>
            <Select
              value={beverageId}
              onChange={(e) => setBeverageId(e.target.value)}
              className="text-sm"
            >
              <option value="">Alle drikkevarer</option>
              {beveragesFiltered.map((b) => (
                <option key={b.id} value={b.id}>
                  {beverageLabel(b)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingState />
      ) : filteredReviews.length === 0 ? (
        <EmptyState>
          {list.length === 0 ? "Ingen anmeldelser endnu." : "Ingen anmeldelser for valgte filter."}
        </EmptyState>
      ) : (
        <>
          <p className="text-heading-muted mb-2 text-sm">
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
                      {r.title ? ` – ${r.title}` : ""}
                    </AccentLink>
                    {beverage && (
                      <p className="text-heading-muted mt-1 text-sm">
                        <AccentLink href={`/beverages/${r.beverageId}`} small>
                          {beverageLabel(beverage)}
                        </AccentLink>
                      </p>
                    )}
                    {r.description && (
                      <p className="text-heading-muted mt-1 text-sm">{r.description}</p>
                    )}
                  </div>
                  <span className="text-heading-muted shrink-0 text-xs">{r.userId}</span>
                </CardListItem>
              );
            })}
          </CardList>
        </>
      )}
    </div>
  );
}
