"use client";

import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  type BeverageCategory,
} from "@/lib/api-client";
import {
  PageHeading,
  SectionHeading,
  Card,
  CardList,
  CardListItem,
  Button,
  Input,
  Label,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";
export default function CategoriesPage() {
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
    const err = (res as { error?: { message?: string } }).error;
    if (err) {
      setError(err.message || "Kunne ikke hente kategorier");
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
      body: { name: name.trim(), description: description.trim() || undefined },
    });
    setSubmitting(false);
    const createErr = (createRes as { error?: { message?: string } }).error;
    if (createErr) {
      setError(createErr.message || "Kunne ikke oprette kategori");
      return;
    }
    setName("");
    setDescription("");
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  return (
    <div>
      <PageHeading>Kategorier</PageHeading>

      <Card as="form" onSubmit={handleSubmit} className="mb-8">
        <SectionHeading className="mb-4">Opret ny kategori</SectionHeading>
        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Navn</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="fx Øl"
            />
          </div>
          <div className="min-w-[200px] flex-1">
            <Label>Beskrivelse</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valgfri"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Opretter…" : "Opret"}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Alert className="mb-4">{error}</Alert>
      )}

      <section>
        <SectionHeading>Eksisterende kategorier</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : list.length === 0 ? (
          <EmptyState>Ingen kategorier endnu.</EmptyState>
        ) : (
          <CardList>
            {list.map((c) => (
              <CardListItem key={c.id}>
                <div>
                  <AccentLink href={`/categories/${encodeURIComponent(c.id ?? "")}`}>
                    {c.name}
                  </AccentLink>
                  {c.description && (
                    <span className="text-heading-muted ml-2 text-sm">
                      {c.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <AccentLink
                    href={`/questions?categoryId=${encodeURIComponent(c.id ?? "")}`}
                    small
                  >
                    Tilføj spørgsmål
                  </AccentLink>
                  <span className="text-heading-muted text-xs">{c.id}</span>
                </div>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
