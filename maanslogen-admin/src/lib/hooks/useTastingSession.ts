"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  getArrangementById,
  getReviewsByUser,
  createReviewWithAnswers,
  type Arrangement,
  type ArrangementBeverageItem,
  type TastingReview,
} from "@/lib/arrangement-api";
import { findAllQuestions, getAllTypes, userControllerGetAll } from "@/lib/api-client";
import type { Question, BeverageType } from "@/lib/api/types.gen";

export type TastingStep = "setup" | "tasting" | "done";

export function useTastingSession(arrangementId: string) {
  const [arrangement, setArrangement] = useState<Arrangement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [step, setStep] = useState<TastingStep>("setup");
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [existingReviews, setExistingReviews] = useState<TastingReview[]>([]);

  // Setup form
  const [userId, setUserId] = useState("");

  // Tasting state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(3);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Beverages in order
  const beverages = useMemo(
    () => [...(arrangement?.beverages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [arrangement],
  );

  const currentBeverage: ArrangementBeverageItem | undefined = beverages[currentIndex];

  // Questions relevant to the current beverage
  const questionsForCurrentBeverage = useMemo(() => {
    if (!currentBeverage) return [];
    const beverageTypeId = currentBeverage.beverage.beverageTypeId;
    const beverageType = types.find((t) => t.id === beverageTypeId);
    if (!beverageType) return [];
    return questions.filter((q) => {
      if (q.categoryId !== beverageType.categoryId) return false;
      // typeId in generated types is { [key: string]: unknown } but at runtime it's a string or null
      const qTypeId = typeof q.typeId === "string" ? q.typeId : undefined;
      if (qTypeId && qTypeId !== beverageTypeId) return false;
      return true;
    });
  }, [currentBeverage, types, questions]);

  // Check if the current beverage already has a review from this user
  const existingReviewForCurrent = useMemo(() => {
    if (!currentBeverage || !userId) return undefined;
    return existingReviews.find(
      (r) => r.beverageId === currentBeverage.beverage.id && r.userId === userId,
    );
  }, [currentBeverage, userId, existingReviews]);

  const isComplete = currentIndex >= beverages.length;

  // Load arrangement + supporting data
  useEffect(() => {
    if (!arrangementId) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    Promise.all([
      getArrangementById(arrangementId),
      userControllerGetAll(),
      findAllQuestions(),
      getAllTypes(),
    ]).then(([arrRes, usersRes, questionsRes, typesRes]) => {
      if (cancelled) return;
      if (arrRes.error || !arrRes.data) {
        setLoadError(arrRes.error?.message ?? "Arrangement ikke fundet");
      } else {
        setArrangement(arrRes.data);
      }
      if (!usersRes.error && usersRes.data) setUsers(usersRes.data as { id: string; username: string }[]);
      if (!questionsRes.error && questionsRes.data) setQuestions(questionsRes.data);
      if (!typesRes.error && typesRes.data) setTypes(typesRes.data as BeverageType[]);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [arrangementId]);

  // Load existing reviews when user is selected
  useEffect(() => {
    if (!userId) {
      setExistingReviews([]);
      return;
    }
    getReviewsByUser(userId).then((res) => {
      if (!res.error && res.data) setExistingReviews(res.data);
    });
  }, [userId]);

  function resetForm() {
    setRating(3);
    setTitle("");
    setDescription("");
    setAnswers({});
    setError(null);
  }

  const startTasting = useCallback(() => {
    if (!userId) return;
    setCurrentIndex(0);
    setSkippedIds(new Set());
    setCompletedIds(new Set());
    resetForm();
    setStep("tasting");
  }, [userId]);

  const goToNext = useCallback(() => {
    resetForm();
    setCurrentIndex((i) => i + 1);
  }, []);

  const handleSkip = useCallback(() => {
    if (!currentBeverage) return;
    setSkippedIds((prev) => new Set([...prev, currentBeverage.beverage.id]));
    goToNext();
  }, [currentBeverage, goToNext]);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!currentBeverage || !userId) return;
    setSubmitting(true);
    setError(null);

    const answerItems = questionsForCurrentBeverage
      .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "")
      .map((q) => ({ questionId: q.id, answer: answers[q.id] }));

    const res = await createReviewWithAnswers({
      userId,
      beverageId: currentBeverage.beverage.id,
      rating,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      answers: answerItems,
    });

    setSubmitting(false);

    if (res.error) {
      setError(res.error.message ?? "Der opstod en fejl");
      return;
    }

    setCompletedIds((prev) => new Set([...prev, currentBeverage.beverage.id]));
    // Refresh existing reviews list with the newly created review
    if (res.data) {
      setExistingReviews((prev) => {
        const withoutOld = prev.filter((r) => r.beverageId !== currentBeverage.beverage.id);
        return [...withoutOld, res.data!];
      });
    }
    goToNext();
  }, [currentBeverage, userId, rating, title, description, questionsForCurrentBeverage, answers, goToNext]);

  return {
    // State
    arrangement,
    loading,
    loadError,
    step,
    users,
    beverages,
    currentIndex,
    currentBeverage,
    questionsForCurrentBeverage,
    existingReviewForCurrent,
    isComplete,
    userId,
    rating,
    title,
    description,
    answers,
    submitting,
    error,
    skippedIds,
    completedIds,
    // Actions
    setUserId,
    setRating,
    setTitle,
    setDescription,
    setAnswer,
    startTasting,
    handleSkip,
    handleSubmit,
  };
}
