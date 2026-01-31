"use client";

import { useEffect, useState } from "react";
import {
  findAllAttributes,
  getAllCategories,
  getAllTypes,
  createAttribute,
  type AttributeDefinition,
  type BeverageCategory,
  type BeverageType,
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
  Select,
  Alert,
  AccentLink,
} from "@/app/components/ui";
import { EmptyState, LoadingState } from "@/app/components/data";

export default function AttributesPage() {
  const [list, setList] = useState<AttributeDefinition[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [attributeKey, setAttributeKey] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [dataType, setDataType] = useState<"string" | "number" | "boolean">("string");
  const [filterable, setFilterable] = useState(false);
  const [required, setRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const [attrRes, categoriesRes, typesRes] = await Promise.all([
      findAllAttributes(),
      getAllCategories(),
      getAllTypes(),
    ]);
    const attrErr = (attrRes as { error?: { message?: string }; data?: AttributeDefinition[] }).error;
    if (attrErr) setError(attrErr.message || "Kunne ikke hente attribute");
    else setList(attrRes.data ?? []);
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      const firstId = categoriesRes.data[0]?.id;
      if (!categoryId && firstId) setCategoryId(firstId);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !attributeKey.trim() || !displayName.trim() || !dataType) return;
    setSubmitting(true);
    setError(null);
    const createRes = await createAttribute({
      body: { categoryId, typeId: typeId || undefined, attributeKey: attributeKey.trim(), displayName: displayName.trim(), dataType, filterable, required },
    });
    setSubmitting(false);
    const createErr = (createRes as { error?: { message?: string } }).error;
    if (createErr) {
      setError(createErr.message || "Kunne ikke oprette attributedefinition");
      return;
    }
    setAttributeKey("");
    setDisplayName("");
    setTypeId("");
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const typeMap = Object.fromEntries(types.map((t) => [t.id, t.name]));
  const typesInCategory = categoryId ? types.filter((t) => t.categoryId === categoryId) : types;

  return (
    <div>
      <PageHeading>Attributedefinitioner</PageHeading>

      <Card as="form" onSubmit={handleSubmit} className="mb-8">
        <SectionHeading className="mb-4">Opret ny attributedefinition</SectionHeading>
        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={categoryId}
              onChange={(e) => {
                const newCategoryId = e.target.value;
                setCategoryId(newCategoryId);
                if (typeId && types.find((t) => t.id === typeId)?.categoryId !== newCategoryId) setTypeId("");
              }}
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
              {typesInCategory.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Attribut-nøgle</Label>
            <Input
              type="text"
              value={attributeKey}
              onChange={(e) => setAttributeKey(e.target.value)}
              placeholder="fx abv"
            />
          </div>
          <div>
            <Label>Visningsnavn</Label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="fx Alkohol %"
            />
          </div>
          <div>
            <Label>Datatype</Label>
            <Select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as "string" | "number" | "boolean")}
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterable}
                onChange={(e) => setFilterable(e.target.checked)}
                className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
              />
              <span className="text-heading-muted text-sm">Filterbar</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
              />
              <span className="text-heading-muted text-sm">Påkrævet</span>
            </label>
          </div>
          <div className="flex w-full items-end sm:w-auto">
            <Button
              type="submit"
              disabled={submitting || !categoryId || !attributeKey.trim() || !displayName.trim()}
            >
              {submitting ? "Opretter…" : "Opret"}
            </Button>
          </div>
        </div>
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section>
        <SectionHeading>Eksisterende attributedefinitioner</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : list.length === 0 ? (
          <EmptyState>Ingen attributedefinitioner endnu.</EmptyState>
        ) : (
          <CardList>
            {list.map((a) => (
              <CardListItem key={a.id}>
                <div>
                  <AccentLink href={`/attributes/${encodeURIComponent(a.id ?? "")}`}>
                    {a.displayName}
                  </AccentLink>
                  <span className="text-heading-muted ml-2 text-sm">
                    ({a.attributeKey}, {a.dataType})
                  </span>
                  <span className="text-heading-muted ml-2 text-sm">
                    {a.categoryId ? (categoryMap[a.categoryId] ?? a.categoryId) : ""}
                    {a.typeId ? ` / ${typeMap[a.typeId] ?? a.typeId}` : ""}
                  </span>
                </div>
                <span className="text-heading-muted text-xs">
                  {a.filterable ? "Filterbar" : ""} {a.required ? "Påkrævet" : ""}
                </span>
              </CardListItem>
            ))}
          </CardList>
        )}
      </section>
    </div>
  );
}
