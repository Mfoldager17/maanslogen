"use client";

import { useEffect, useState } from "react";
import { getAllBrands, getAllCategories, createBrand, deleteBrand, type Brand } from "@/lib/api-client";
import { getApiError } from "./useApiError";

export function useBrands() {
  const [list, setList] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const [brandsRes, categoriesRes] = await Promise.all([getAllBrands(), getAllCategories()]);
    const err = getApiError(brandsRes);
    if (err) {
      setError(err);
      setList([]);
    } else {
      setList(brandsRes.data ?? []);
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function toggleCategoryId(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createBrand({
      body: {
        name: name.trim(),
        description: description.trim() || undefined,
        active,
        categoryIds: categoryIds.length ? categoryIds : undefined,
      },
    });
    setSubmitting(false);
    const createErr = getApiError(createRes);
    if (createErr) {
      setError(createErr);
      return;
    }
    setName("");
    setDescription("");
    setCategoryIds([]);
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  async function handleDelete(id: string) {
    setError(null);
    const res = await deleteBrand({ path: { id } });
    const err = getApiError(res);
    if (err) {
      setError(err);
      return false;
    }
    setList((prev) => prev.filter((b) => b.id !== id));
    return true;
  }

  return {
    list,
    categories,
    loading,
    error,
    name,
    setName,
    description,
    setDescription,
    active,
    setActive,
    categoryIds,
    toggleCategoryId,
    submitting,
    handleSubmit,
    handleDelete,
    load,
  };
}
