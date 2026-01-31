"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  findAllQuestions,
  getAllCategories,
  getAllTypes,
  createQuestion,
  deleteQuestion,
  type Question,
  type BeverageCategory,
  type BeverageType,
} from "@/lib/api-client";
import { getApiError } from "./useApiError";

export const ANSWER_TYPES = ["text", "number", "select", "rating"] as const;

export function useQuestions() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const typeIdFromUrl = searchParams.get("typeId");

  const [list, setList] = useState<Question[] | undefined>(undefined);
  const [categories, setCategories] = useState<BeverageCategory[] | undefined>(undefined);
  const [types, setTypes] = useState<BeverageType[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(categoryIdFromUrl ?? "");
  const [typeId, setTypeId] = useState(typeIdFromUrl ?? "");
  const [onlyCategoryWide, setOnlyCategoryWide] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [answerType, setAnswerType] = useState<(typeof ANSWER_TYPES)[number]>("text");
  const [sortOrder, setSortOrder] = useState("");
  const [required, setRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (categoryIdFromUrl) setCategoryId(categoryIdFromUrl);
    if (typeIdFromUrl) setTypeId(typeIdFromUrl);
  }, [categoryIdFromUrl, typeIdFromUrl]);

  async function load() {
    setLoading(true);
    setError(null);
    const [questionsRes, categoriesRes, typesRes] = await Promise.all([
      findAllQuestions(),
      getAllCategories(),
      getAllTypes(),
    ]);
    const err = getApiError(questionsRes);
    if (err) {
      setError(err);
      setList([]);
    } else {
      setList(questionsRes.data ?? []);
    }
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      setCategoryId((prev) => {
        if (prev) return prev;
        if (categoryIdFromUrl) return categoryIdFromUrl;
        return categoriesRes.data?.[0]?.id ?? "";
      });
    }
    if (typesRes.data) setTypes(typesRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const cats = categories ?? [];
    const firstId = cats[0]?.id;
    if (cats.length && !categoryId && firstId) setCategoryId(firstId);
  }, [categories, categoryId]);

  const filteredQuestions = useMemo(() => {
    const listArr = list ?? [];
    return listArr.filter((q) => {
      const qTypeId = typeof q.typeId === "string" ? q.typeId : undefined;
      const matchCat = !categoryId || q.categoryId === categoryId;
      const matchType = !typeId || qTypeId === typeId;
      const matchScope = !onlyCategoryWide || qTypeId == null || qTypeId === "";
      return matchCat && matchType && matchScope;
    });
  }, [list, categoryId, typeId, onlyCategoryWide]);

  const categoryMap = useMemo(
    () => Object.fromEntries((categories ?? []).map((c) => [c.id, c.name])),
    [categories],
  );
  const typeMap = useMemo(
    () => Object.fromEntries((types ?? []).map((t) => [t.id, t.name])),
    [types],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId.trim() || !questionText.trim() || !answerType) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createQuestion({
      body: {
        categoryId,
        typeId: typeId || undefined,
        questionText: questionText.trim(),
        answerType,
        sortOrder: sortOrder === "" ? undefined : parseInt(sortOrder, 10),
        required,
      },
    });
    setSubmitting(false);
    const createErr = getApiError(createRes);
    if (createErr) {
      setError(createErr);
      return;
    }
    setQuestionText("");
    setSortOrder("");
    if (createRes.data) setList((prev) => [...(prev ?? []), createRes.data]);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    const res = await deleteQuestion({ path: { id } });
    setDeletingId(null);
    const err = getApiError(res);
    if (err) {
      setError(err);
      return;
    }
    await load();
  }

  return {
    list: list ?? [],
    categories: categories ?? [],
    types: types ?? [],
    filteredQuestions,
    categoryMap,
    typeMap,
    loading,
    error,
    categoryId,
    setCategoryId,
    typeId,
    setTypeId,
    onlyCategoryWide,
    setOnlyCategoryWide,
    questionText,
    setQuestionText,
    answerType,
    setAnswerType,
    sortOrder,
    setSortOrder,
    required,
    setRequired,
    submitting,
    deletingId,
    handleSubmit,
    handleDelete,
  };
}
