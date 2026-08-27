"use client";

import { useParams } from "next/navigation";
import { useTastingSession } from "@/lib/hooks";
import { Button, Card, SectionHeading, Alert, SelectField, LinkButton } from "@/app/components/ui";
import { BackLink } from "@/app/components/layout";
import { LoadingState } from "@/app/components/data";
import type { Question } from "@/lib/api/types.gen";

// ── Star rating picker ────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} stjerne${star !== 1 ? "r" : ""}`}
          onClick={() => onChange(star)}
          className={`text-2xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            star <= value ? "text-yellow-400" : "text-foreground-muted/30"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-foreground-muted">{value}/5</span>
    </div>
  );
}

// ── Single question input ─────────────────────────────────────────────────────

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = Array.isArray(question.options) ? (question.options as string[]) : [];

  switch (question.answerType) {
    case "select":
      return (
        <SelectField
          label={`${question.questionText}${question.required ? " *" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          id={`q-${question.id}`}
        >
          <option value="">Vælg…</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </SelectField>
      );

    case "rating":
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {question.questionText}
            {question.required ? " *" : ""}
          </span>
          <StarRating
            value={value ? parseInt(value, 10) : 0}
            onChange={(v) => onChange(String(v))}
          />
        </div>
      );

    case "number":
      return (
        <div className="flex flex-col gap-1">
          <label htmlFor={`q-${question.id}`} className="text-sm font-medium text-foreground">
            {question.questionText}
            {question.required ? " *" : ""}
          </label>
          <input
            id={`q-${question.id}`}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-full rounded border border-border bg-background-elevated px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      );

    default:
      return (
        <div className="flex flex-col gap-1">
          <label htmlFor={`q-${question.id}`} className="text-sm font-medium text-foreground">
            {question.questionText}
            {question.required ? " *" : ""}
          </label>
          <textarea
            id={`q-${question.id}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-foreground placeholder:text-foreground-muted/80 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Skriv dit svar…"
          />
        </div>
      );
  }
}

// ── Setup screen ──────────────────────────────────────────────────────────────

function SetupScreen({
  arrangementName,
  beverageCount,
  users,
  userId,
  setUserId,
  onStart,
}: {
  arrangementName: string;
  beverageCount: number;
  users: { id: string; username: string }[];
  userId: string;
  setUserId: (id: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{arrangementName}</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          {beverageCount} drikkevare{beverageCount !== 1 ? "r" : ""} i rækkefølge
        </p>
      </div>
      <Card>
        <div className="space-y-4">
          <SectionHeading className="mt-0">Hvem smager?</SectionHeading>
          <SelectField
            label="Vælg bruger"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            id="tasting-user"
          >
            <option value="">Vælg bruger…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </SelectField>
          <Button
            type="button"
            disabled={!userId}
            onClick={onStart}
            className="w-full"
          >
            Start smagning →
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ── Done screen ───────────────────────────────────────────────────────────────

function DoneScreen({
  arrangementId,
  completedCount,
  skippedCount,
  totalCount,
}: {
  arrangementId: string;
  completedCount: number;
  skippedCount: number;
  totalCount: number;
}) {
  return (
    <Card className="text-center">
      <div className="py-6 space-y-4">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-semibold text-foreground">Smagningen er færdig!</h2>
        <p className="text-foreground-muted text-sm">
          {completedCount} anmeldelse{completedCount !== 1 ? "r" : ""} afgivet
          {skippedCount > 0 ? `, ${skippedCount} sprunget over` : ""}
          {" "}(af {totalCount} drikkevarer)
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <LinkButton href={`/arrangements/${encodeURIComponent(arrangementId)}`} variant="secondary">
            ← Tilbage til arrangement
          </LinkButton>
          <LinkButton href="/reviews">Se anmeldelser</LinkButton>
        </div>
      </div>
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TastingSessionClient() {
  const params = useParams();
  const arrangementId = (params?.id as string) ?? "";

  const {
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
    setUserId,
    setRating,
    setTitle,
    setDescription,
    setAnswer,
    startTasting,
    handleSkip,
    handleSubmit,
  } = useTastingSession(arrangementId);

  if (loading) {
    return (
      <div>
        <BackLink href={`/arrangements/${encodeURIComponent(arrangementId)}`}>
          ← Tilbage til arrangement
        </BackLink>
        <LoadingState />
      </div>
    );
  }

  if (loadError || !arrangement) {
    return (
      <div>
        <BackLink href="/arrangements">← Tilbage til arrangementer</BackLink>
        <Alert>{loadError ?? "Arrangement ikke fundet"}</Alert>
      </div>
    );
  }

  if (beverages.length === 0) {
    return (
      <div>
        <BackLink href={`/arrangements/${encodeURIComponent(arrangementId)}`}>
          ← Tilbage til arrangement
        </BackLink>
        <Alert>
          Dette arrangement har ingen drikkevarer.{" "}
          <a href={`/arrangements/${encodeURIComponent(arrangementId)}/edit`} className="underline">
            Tilføj drikkevarer
          </a>{" "}
          først.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href={`/arrangements/${encodeURIComponent(arrangementId)}`}>
        ← Tilbage til arrangement
      </BackLink>

      {step === "setup" && (
        <SetupScreen
          arrangementName={arrangement.name}
          beverageCount={beverages.length}
          users={users}
          userId={userId}
          setUserId={setUserId}
          onStart={startTasting}
        />
      )}

      {step === "tasting" && isComplete && (
        <DoneScreen
          arrangementId={arrangementId}
          completedCount={completedIds.size}
          skippedCount={skippedIds.size}
          totalCount={beverages.length}
        />
      )}

      {step === "tasting" && !isComplete && currentBeverage && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-foreground-muted">
            <span>
              Drikkevare {currentIndex + 1} af {beverages.length}
            </span>
            <span>
              {completedIds.size} anmeldt{skippedIds.size > 0 ? `, ${skippedIds.size} sprunget over` : ""}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-background-hover overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${((completedIds.size + skippedIds.size) / beverages.length) * 100}%` }}
            />
          </div>

          <Card>
            {/* Beverage header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {currentBeverage.beverage.name}
              </h2>
              {currentBeverage.beverage.brand?.name && (
                <p className="text-foreground-muted text-sm mt-0.5">
                  {currentBeverage.beverage.brand.name}
                </p>
              )}
            </div>

            {existingReviewForCurrent && (
              <Alert className="mb-4">
                Du har allerede anmeldt denne drikkevare (bedømmelse:{" "}
                {existingReviewForCurrent.rating}/5). En ny anmeldelse kan ikke oprettes.
                <button
                  type="button"
                  onClick={handleSkip}
                  className="ml-2 underline text-inherit"
                >
                  Spring over →
                </button>
              </Alert>
            )}

            {!existingReviewForCurrent && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-5"
              >
                {/* Rating */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">Bedømmelse *</span>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Dynamic questions */}
                {questionsForCurrentBeverage.length > 0 && (
                  <div className="space-y-4">
                    <SectionHeading className="mt-2">Spørgsmål</SectionHeading>
                    {questionsForCurrentBeverage.map((q) => (
                      <QuestionInput
                        key={q.id}
                        question={q}
                        value={answers[q.id] ?? ""}
                        onChange={(v) => setAnswer(q.id, v)}
                      />
                    ))}
                  </div>
                )}

                {/* Optional fields */}
                <div className="space-y-4 border-t border-border pt-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="tasting-title" className="text-sm font-medium text-foreground">
                      Overskrift (valgfri)
                    </label>
                    <input
                      id="tasting-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="fx Glimrende!"
                      className="h-11 w-full rounded border border-border bg-background-elevated px-3 py-2 text-foreground placeholder:text-foreground-muted/80 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="tasting-description"
                      className="text-sm font-medium text-foreground"
                    >
                      Kommentar (valgfri)
                    </label>
                    <textarea
                      id="tasting-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Uddybende kommentar…"
                      className="w-full rounded border border-border bg-background-elevated px-3 py-2 text-foreground placeholder:text-foreground-muted/80 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                {error && <Alert>{error}</Alert>}

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Gemmer…" : "Gem anmeldelse →"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSkip}
                    disabled={submitting}
                  >
                    Spring over
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Beverage list overview */}
          <details className="text-sm text-foreground-muted">
            <summary className="cursor-pointer select-none hover:text-foreground">
              Vis alle drikkevarer ({beverages.length})
            </summary>
            <ol className="mt-2 space-y-1 pl-4 list-decimal">
              {beverages.map((bev, i) => {
                const isDone = completedIds.has(bev.beverage.id);
                const isSkipped = skippedIds.has(bev.beverage.id);
                const isCurrent = i === currentIndex;
                return (
                  <li
                    key={bev.id}
                    className={
                      isDone
                        ? "text-green-600 dark:text-green-400 line-through"
                        : isSkipped
                          ? "text-foreground-muted/50 line-through"
                          : isCurrent
                            ? "font-semibold text-foreground"
                            : ""
                    }
                  >
                    {bev.beverage.name}
                    {bev.beverage.brand?.name ? ` (${bev.beverage.brand.name})` : ""}
                    {isDone ? " ✓" : isSkipped ? " –" : isCurrent ? " ←" : ""}
                  </li>
                );
              })}
            </ol>
          </details>
        </div>
      )}
    </div>
  );
}
