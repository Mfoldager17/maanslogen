"use client";

import { useEffect, useState } from "react";
import { getAllCategories, createCategory, type BeverageCategory } from "@/lib/api-client";
import { getApiError } from "./useApiError";

export function useCategories() {
  const [list, setList] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await getAllCategories();
    const err = getApiError(res);
    if (err) {
      setError(err);
      setList([]);
    } else {
      setList(res.data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createCategory({
      body: { name: name.trim(), description: description.trim() || "" },
    });
    setSubmitting(false);
    const createErr = getApiError(createRes);
    if (createErr) {
      setError(createErr);
      return;
    }
    setName("");
    setDescription("");
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  return {
    list,
    loading,
    error,
    name,
    setName,
    description,
    setDescription,
    submitting,
    handleSubmit,
  };
}
