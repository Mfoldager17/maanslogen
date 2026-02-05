"use client";

import { useEffect, useState, useMemo } from "react";
import {
  findAllAttributes,
  getAllCategories,
  getAllTypes,
  createAttribute,
  type AttributeDefinition,
  type BeverageCategory,
  type BeverageType,
} from "@/lib/api-client";
import { getApiError } from "./useApiError";

export function useAttributes() {
  const [list, setList] = useState<AttributeDefinition[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [typeIds, setTypeIds] = useState<string[]>([]);
  const [attributeKey, setAttributeKey] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [dataType, setDataType] = useState<"string" | "number" | "boolean">("string");
  const [filterable, setFilterable] = useState(false);
  const [required, setRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const [attrRes, categoriesRes, typesRes] = await Promise.all([
      findAllAttributes(),
      getAllCategories(),
      getAllTypes(),
    ]);
    const attrErr = getApiError(attrRes);
    if (attrErr) setError(attrErr);
    else setList(attrRes.data ?? []);
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      setCategoryIds((prev) => (prev.length ? prev : (categoriesRes.data?.[0]?.id ? [categoriesRes.data[0].id] : [])));
    }
    if (typesRes.data) setTypes(typesRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const firstId = categories[0]?.id;
    if (categories.length && categoryIds.length === 0 && firstId) setCategoryIds([firstId]);
  }, [categories, categoryIds.length]);

  function toggleCategoryId(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleTypeId(id: string) {
    setTypeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (categoryIds.length === 0 || !attributeKey.trim() || !displayName.trim() || !dataType) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createAttribute({
      body: {
        categoryIds,
        typeIds: typeIds.length ? typeIds : undefined,
        attributeKey: attributeKey.trim(),
        displayName: displayName.trim(),
        dataType,
        filterable,
        required,
      } as unknown as Parameters<typeof createAttribute>[0]["body"],
    });
    setSubmitting(false);
    const createErr = getApiError(createRes);
    if (createErr) {
      setError(createErr);
      return;
    }
    setAttributeKey("");
    setDisplayName("");
    setTypeIds([]);
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);
  const typeMap = useMemo(() => Object.fromEntries(types.map((t) => [t.id, t.name])), [types]);
  const typesInSelectedCategories = categoryIds.length
    ? types.filter((t) => t.categoryId && categoryIds.includes(t.categoryId))
    : types;

  return {
    list,
    categories,
    types,
    loading,
    error,
    categoryIds,
    setCategoryIds,
    toggleCategoryId,
    typeIds,
    setTypeIds,
    toggleTypeId,
    attributeKey,
    setAttributeKey,
    displayName,
    setDisplayName,
    dataType,
    setDataType,
    filterable,
    setFilterable,
    required,
    setRequired,
    submitting,
    handleSubmit,
    categoryMap,
    typeMap,
    typesInSelectedCategories,
  };
}
