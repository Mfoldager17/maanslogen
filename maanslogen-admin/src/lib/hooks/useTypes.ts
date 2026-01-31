"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllTypes, getAllCategories, createType, type BeverageCategory, type BeverageType } from "@/lib/api-client";
import { getApiError } from "./useApiError";

export function useTypes() {
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const [typesRes, categoriesRes] = await Promise.all([getAllTypes(), getAllCategories()]);
    const typesErr = getApiError(typesRes);
    if (typesErr) setError(typesErr);
    else setTypes(typesRes.data ?? []);
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      setCategoryId((prev) => prev || (categoriesRes.data?.[0]?.id ?? ""));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const firstId = categories[0]?.id;
    if (categories.length && !categoryId && firstId) setCategoryId(firstId);
  }, [categories, categoryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createType({
      body: { name: name.trim(), categoryId, description: description.trim() || undefined, active },
    });
    setSubmitting(false);
    const createErr = getApiError(createRes);
    if (createErr) {
      setError(createErr);
      return;
    }
    setName("");
    setDescription("");
    if (createRes.data) setTypes((prev) => [...prev, createRes.data]);
  }

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  return {
    types,
    categories,
    loading,
    error,
    name,
    setName,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    active,
    setActive,
    submitting,
    handleSubmit,
    categoryMap,
  };
}
