"use client";

import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  CollapsibleCard,
  Button,
  Input,
  Label,
  Select,
  Alert,
  AccentLink,
  LinkButton,
} from "@/app/components/ui";
import { IconTrash } from "@/app/components/layout";
import { EmptyState, LoadingState } from "@/app/components/data";
import { useQuestions, ANSWER_TYPES } from "@/lib/hooks";

export function QuestionsPageClient() {
  const {
    filteredQuestions,
    categories,
    types,
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
  } = useQuestions();

  return (
    <div>
      <PageHeading>Spørgsmål (til anmeldelser)</PageHeading>
      <p className="text-heading-muted mb-6 text-sm">
        Spørgsmål kan knyttes til en kategori (gælder alle typer) eller til en bestemt type. Du kan også tilføje spørgsmål direkte fra{" "}
        <AccentLink href="/categories" small>Kategorier</AccentLink> eller{" "}
        <AccentLink href="/types" small>Typer</AccentLink> via &quot;Tilføj spørgsmål&quot;.
      </p>

      <CollapsibleCard title="Tilføj spørgsmål" defaultOpen={false} className="mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
          <div>
            <Label>Kategori</Label>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type (valgfri)</Label>
            <Select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
              <option value="">Alle typer i kategorien</option>
              {types.filter((t) => t.categoryId === categoryId).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </div>
          <div className="min-w-60 flex-1">
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
                <option key={a} value={a}>{a}</option>
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
            <Label htmlFor="required" className="mb-0 text-sm">Påkrævet</Label>
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
        </form>
      </CollapsibleCard>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <SectionHeading className="mb-0">Filtre</SectionHeading>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="text-sm">
            <option value="">Alle kategorier</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select value={typeId} onChange={(e) => setTypeId(e.target.value)} className="text-sm">
            <option value="">Alle typer</option>
            {types.filter((t) => !categoryId || t.categoryId === categoryId).map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={onlyCategoryWide}
              onChange={(e) => setOnlyCategoryWide(e.target.checked)}
              className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
            />
            <span className="text-heading-muted text-sm">Kun hele kategorien</span>
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
                    ({q.answerType}{q.required ? ", påkrævet" : ""})
                  </span>
                  <span className="text-heading-muted ml-2 text-sm">
                    {q.categoryId ? (categoryMap[q.categoryId] ?? q.categoryId) : ""}
                    {typeof q.typeId === "string" ? ` / ${typeMap[q.typeId] ?? q.typeId}` : " (hele kategorien)"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-heading-muted text-xs">
                    {typeof q.sortOrder === "number" ? `#${q.sortOrder}` : ""}
                  </span>
                  <Button
                    type="button"
                    variant="danger"
                    iconOnly
                    aria-label="Slet"
                    onClick={() => q.id && handleDelete(q.id)}
                    disabled={deletingId === q.id}
                    className="disabled:opacity-50"
                  >
                    <IconTrash className="h-5 w-5" />
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
