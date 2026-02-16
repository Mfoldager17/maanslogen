"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllArrangements,
  getArrangementById,
  createArrangement,
  updateArrangement,
  deleteArrangement,
  type Arrangement,
  type CreateArrangementBody,
  type UpdateArrangementBody,
} from "@/lib/arrangement-api";
import { getAllBeverages, userControllerGetAll, getAllCategories, getAllTypes, getAllBrands } from "@/lib/api-client";
import { getApiError } from "./useApiError";

export function useArrangements() {
  const [list, setList] = useState<Arrangement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdById, setCreatedById] = useState("");
  const [beverageRows, setBeverageRows] = useState<{ beverageId: string; sortOrder: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [beverages, setBeverages] = useState<{ id: string; name: string; beverageTypeId?: string; brand?: { name: string } }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [types, setTypes] = useState<{ id: string; name: string; categoryId: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    const [arrRes, usersRes, bevRes, catRes, typesRes, brandsRes] = await Promise.all([
      getAllArrangements(),
      userControllerGetAll(),
      getAllBeverages(),
      getAllCategories(),
      getAllTypes(),
      getAllBrands(),
    ]);
    const arrErr = getApiError(arrRes as { error?: unknown });
    if (arrErr) {
      setError(arrErr);
      setList([]);
    } else {
      setList((arrRes.data ?? []) as Arrangement[]);
    }
    if (!getApiError(usersRes as { error?: unknown })) setUsers((usersRes.data ?? []) as { id: string; username: string }[]);
    if (!getApiError(bevRes as { error?: unknown })) setBeverages((bevRes.data ?? []) as { id: string; name: string; beverageTypeId?: string; brand?: { name: string } }[]);
    if (!getApiError(catRes as { error?: unknown })) setCategories((catRes.data ?? []) as { id: string; name: string }[]);
    if (!getApiError(typesRes as { error?: unknown })) setTypes((typesRes.data ?? []) as { id: string; name: string; categoryId: string }[]);
    if (!getApiError(brandsRes as { error?: unknown })) setBrands((brandsRes.data ?? []) as { id: string; name: string }[]);
    setLoading(false);
  }

  const filteredBeverages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return beverages.filter((b) => {
      if (beverageRows.some((r) => r.beverageId === b.id)) return false;
      if (filterCategoryId) {
        const t = types.find((x) => x.id === b.beverageTypeId);
        if (!t || t.categoryId !== filterCategoryId) return false;
      }
      if (filterTypeId && b.beverageTypeId !== filterTypeId) return false;
      if (q) {
        const nameMatch = b.name.toLowerCase().includes(q);
        const brandMatch = b.brand?.name?.toLowerCase().includes(q);
        if (!nameMatch && !brandMatch) return false;
      }
      return true;
    });
  }, [beverages, beverageRows, filterCategoryId, filterTypeId, searchQuery, types]);

  async function refreshBeverages() {
    const res = await getAllBeverages();
    if (!getApiError(res as { error?: unknown })) setBeverages((res.data ?? []) as { id: string; name: string; beverageTypeId?: string; brand?: { name: string } }[]);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setCreatedById("");
    setBeverageRows([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !createdById) return;
    setSubmitting(true);
    setError(null);
    const body: CreateArrangementBody = {
      type: "TASTING",
      name: name.trim(),
      description: description.trim() || undefined,
      createdById,
      beverages: beverageRows.map((r, i) => ({ beverageId: r.beverageId, sortOrder: i })),
    };
    const res = await createArrangement(body);
    setSubmitting(false);
    const err = res.error?.message ?? null;
    if (err) {
      setError(err);
      return;
    }
    resetForm();
    if (res.data) setList((prev) => [res.data!, ...prev]);
  }

  async function handleDelete(id: string) {
    setError(null);
    const res = await deleteArrangement(id);
    const err = res.error?.message ?? null;
    if (err) {
      setError(err);
      return false;
    }
    setList((prev) => prev.filter((a) => a.id !== id));
    return true;
  }

  async function handleUpdate(id: string, body: UpdateArrangementBody) {
    setSubmitting(true);
    setError(null);
    const res = await updateArrangement(id, body);
    setSubmitting(false);
    const err = res.error?.message ?? null;
    if (err) {
      setError(err);
      return null;
    }
    if (res.data) {
      setList((prev) => prev.map((a) => (a.id === id ? res.data! : a)));
      return res.data;
    }
    return null;
  }

  function addBeverageRow(beverageId: string) {
    if (!beverageId) return;
    const nextOrder = beverageRows.length;
    setBeverageRows((prev) => [...prev, { beverageId, sortOrder: nextOrder }]);
  }

  function removeBeverageRow(index: number) {
    setBeverageRows((prev) => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, sortOrder: i })));
  }

  function moveBeverageRow(from: number, direction: "up" | "down") {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= beverageRows.length) return;
    setBeverageRows((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next.map((r, i) => ({ ...r, sortOrder: i }));
    });
  }

  return {
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
    setBeverageRows,
    addBeverageRow,
    removeBeverageRow,
    moveBeverageRow,
    users,
    beverages,
    categories,
    types,
    brands,
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
    handleUpdate,
    load,
    resetForm,
  };
}

export function useArrangementById(id: string | null) {
  const [item, setItem] = useState<Arrangement | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setItem(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getArrangementById(id).then((res) => {
      if (cancelled) return;
      if (res.error) setError(res.error.message ?? "Fejl");
      else setItem(res.data ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { item, loading, error };
}
