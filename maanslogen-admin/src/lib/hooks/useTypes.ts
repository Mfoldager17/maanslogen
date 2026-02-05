"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllTypes, getAllCategories, createType, updateType, deleteType, type BeverageCategory, type BeverageType } from "@/lib/api-client";
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

  async function handleDelete(id: string) {
    setError(null);
    const res = await deleteType({ path: { id } });
    const err = getApiError(res);
    if (err) {
      setError(err);
      return false;
    }
    setTypes((prev) => prev.filter((t) => t.id !== id));
    return true;
  }

  async function handleUpdate(
    id: string,
    body: { name?: string; categoryId?: string; description?: string; active?: boolean },
  ) {
    setSubmitting(true);
    setError(null);
    const res = await updateType({ path: { id }, body });
    setSubmitting(false);
    const err = getApiError(res);
    if (err) {
      setError(err);
      return null;
    }
    if (res.data) {
      setTypes((prev) => prev.map((t) => (t.id === id ? (res.data as BeverageType) : t)));
      return res.data as BeverageType;
    }
    return null;
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
    handleDelete,
    handleUpdate,
    load,
    categoryMap,
  };
}
