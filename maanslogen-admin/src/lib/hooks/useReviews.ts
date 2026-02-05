"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllReviews,
  getAllBeverages,
  getAllTypes,
  getAllCategories,
  deleteReview,
  type Review,
  type Beverage,
  type BeverageType,
  type BeverageCategory,
} from "@/lib/api-client";
import { getApiError } from "./useApiError";

export function useReviews() {
  const [list, setList] = useState<Review[]>([]);
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [beverageId, setBeverageId] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    const [reviewsRes, bevRes, typesRes, catRes] = await Promise.all([
      getAllReviews(),
      getAllBeverages(),
      getAllTypes(),
      getAllCategories(),
    ]);
    const err = getApiError(reviewsRes);
    if (err) {
      setError(err);
      setList([]);
    } else {
      setList(reviewsRes.data ?? []);
    }
    if (bevRes.data) setBeverages(bevRes.data);
    if (typesRes.data) setTypes(typesRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
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
    let result: Beverage[];
    if (typeId) result = beverages.filter((b) => b.beverageTypeId === typeId);
    else if (categoryId) {
      const typeIdsInCat = new Set(types.filter((t) => t.categoryId === categoryId).map((t) => t.id));
      result = beverages.filter((b) => b.beverageTypeId && typeIdsInCat.has(b.beverageTypeId));
    } else result = beverages;
    if (beverageId) {
      const selected = beverages.find((b) => b.id === beverageId);
      if (selected && !result.some((b) => b.id === beverageId)) result = [selected, ...result];
    }
    return result;
  }, [beverages, categoryId, typeId, beverageId, types]);

  function beverageLabel(b: Beverage): string {
    const t = b.beverageTypeId ? typeMap[b.beverageTypeId] : null;
    const typeName = t?.name ?? b.beverageTypeId;
    const brandName =
      typeof b.brand === "object" && b.brand?.name != null ? b.brand.name : (b as { brand?: string }).brand ?? "";
    return `${brandName} – ${b.name ?? ""}${typeName ? ` (${typeName})` : ""}`;
  }

  async function handleDelete(id: string) {
    setError(null);
    const res = await deleteReview({ path: { id } });
    const err = getApiError(res);
    if (err) {
      setError(err);
      return false;
    }
    setList((prev) => prev.filter((r) => r.id !== id));
    return true;
  }

  return {
    list,
    beverages,
    types,
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
    typeMap,
    categoryMap,
    typesInCategory,
    beveragesFiltered,
    beverageLabel,
    handleDelete,
    load,
  };
}
