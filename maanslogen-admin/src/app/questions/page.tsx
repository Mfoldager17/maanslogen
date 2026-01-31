"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { findAllQuestions, getAllCategories, getAllTypes, createQuestion, deleteQuestion, type Question, type BeverageCategory, type BeverageType } from "@/lib/api-client";
import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  Button,
  Input,
  Label,
  Select,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";

const ANSWER_TYPES = ["text", "number", "select", "rating"] as const;

function QuestionsContent() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const typeIdFromUrl = searchParams.get("typeId");

  const [list, setList] = useState<Question[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
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

  // Sync from URL when navigating with ?categoryId= or ?typeId=
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
    const qErr = (questionsRes as { error?: { message?: string } }).error;
    if (qErr) {
      setError(qErr.message || "Kunne ikke hente spørgsmål");
      setList([]);
    } else {
      setList(questionsRes.data ?? []);
    }
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      if (!categoryId && categoriesRes.data[0]?.id) setCategoryId(categoriesRes.data[0].id);
      if (categoryIdFromUrl && !categoryId) setCategoryId(categoryIdFromUrl);
    }
    if (typesRes.data) setTypes(typesRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const firstId = categories[0]?.id;
    if (categories.length && !categoryId && firstId) setCategoryId(firstId);
  }, [categories, categoryId]);

  const filteredQuestions = useMemo(() => {
    return list.filter((q) => {
      const matchCat = !categoryId || q.categoryId === categoryId;
      const matchType = !typeId || q.typeId === typeId;
      const matchScope = !onlyCategoryWide || q.typeId == null || q.typeId === "";
      return matchCat && matchType && matchScope;
    });
  }, [list, categoryId, typeId, onlyCategoryWide]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId.trim() || !questionText.trim() || !answerType) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createQuestion({
      body: { categoryId, typeId: typeId || undefined, questionText: questionText.trim(), answerType, sortOrder: sortOrder === "" ? undefined : parseInt(sortOrder, 10), required },
    });
    setSubmitting(false);
    const createErr = (createRes as { error?: { message?: string } }).error;
    if (createErr) {
      setError(createErr.message || "Kunne ikke oprette spørgsmål");
      return;
    }
    setQuestionText("");
    setSortOrder("");
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    const res = await deleteQuestion({ path: { id } });
    setDeletingId(null);
    const err = (res as { error?: { message?: string } }).error;
    if (err) {
      setError(err.message || "Kunne ikke slette spørgsmål");
      return;
    }
    await load();
  }

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);
  const typeMap = useMemo(() => Object.fromEntries(types.map((t) => [t.id, t.name])), [types]);

  return (
    <div>
      <PageHeading>Spørgsmål (til anmeldelser)</PageHeading>
      <p className="text-heading-muted mb-6 text-sm">
        Spørgsmål kan knyttes til en kategori (gælder alle typer) eller til en bestemt type. Du kan også tilføje spørgsmål direkte fra{" "}
        <AccentLink href="/categories" small>Kategorier</AccentLink> eller{" "}
        <AccentLink href="/types" small>Typer</AccentLink> via &quot;Tilføj spørgsmål&quot;.
      </p>

      <Card as="form" onSubmit={handleSubmit} className="mb-8">
        <SectionHeading className="mb-4">Tilføj spørgsmål</SectionHeading>
        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type (valgfri)</Label>
            <Select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              <option value="">Alle typer i kategorien</option>
              {types.filter((t) => t.categoryId === categoryId).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[240px] flex-1">
            <Label>Spørgsmålstekst</Label>
            <Input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="fx Hvordan er aromaen?"
            />
          </div>
          <div>
            <Label>Svar-type</Label>
            <Select
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value as (typeof ANSWER_TYPES)[number])}
            >
              {ANSWER_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Rækkefølge</Label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-20"
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
            />
            <Label htmlFor="required" className="mb-0 text-sm">
              Påkrævet
            </Label>
          </div>
          <div className="flex w-full items-end sm:w-auto">
            <Button
              type="submit"
              disabled={submitting || !categoryId || !questionText.trim()}
            >
              {submitting ? "Tilføjer…" : "Tilføj spørgsmål"}
            </Button>
          </div>
        </div>
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <SectionHeading className="mb-0">Filtre</SectionHeading>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="text-sm"
          >
            <option value="">Alle kategorier</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="text-sm"
          >
            <option value="">Alle typer</option>
            {types
              .filter((t) => !categoryId || t.categoryId === categoryId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </Select>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={onlyCategoryWide}
              onChange={(e) => setOnlyCategoryWide(e.target.checked)}
              className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
            />
            <span className="text-heading-muted text-sm">
              Kun hele kategorien
            </span>
          </label>
        </div>
      </section>

      <section>
        <SectionHeading>
          Spørgsmål {categoryId || typeId ? `(${filteredQuestions.length})` : ""}
        </SectionHeading>
        {loading ? (
          <LoadingState />
        ) : filteredQuestions.length === 0 ? (
          <EmptyState>Ingen spørgsmål for valgte filter.</EmptyState>
        ) : (
          <CardList>
            {filteredQuestions.map((q) => (
              <CardListItem key={q.id}>
                <div>
                  <AccentLink href={`/questions/${encodeURIComponent(q.id ?? "")}`}>
                    {q.questionText}
                  </AccentLink>
                  <span className="text-heading-muted ml-2 text-sm">
                    ({q.answerType}
                    {q.required ? ", påkrævet" : ""})
                  </span>
                  <span className="text-heading-muted ml-2 text-sm">
                    {q.categoryId ? (categoryMap[q.categoryId] ?? q.categoryId) : ""}
                    {q.typeId ? ` / ${typeMap[q.typeId] ?? q.typeId}` : " (hele kategorien)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-heading-muted text-xs">
                    {q.sortOrder != null ? `#${q.sortOrder}` : ""}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => q.id && handleDelete(q.id)}
                    disabled={deletingId === q.id}
                    className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    {deletingId === q.id ? "Sletter…" : "Slet"}
                  </Button>
                </div>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="text-stone-500">Henter…</div>}>
      <QuestionsContent />
    </Suspense>
  );
}
