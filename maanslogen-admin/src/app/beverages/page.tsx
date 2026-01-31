"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { getAllBeverages, getAllTypes, getAllCategories, createBeverage, type Beverage, type BeverageType, type BeverageCategory } from "@/lib/api-client";
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

const API_BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") : "http://localhost:3000";

const THUMBNAIL_SIZE = 200;
const LARGE_SIZE = 800;

type ImageSlotType = "THUMBNAIL" | "LARGE";

/** Skalerer et billede til max bredde/højde (aspect ratio bevares) og returnerer som JPEG-blob. */
function resizeImageToBlob(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const r = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * r);
        height = Math.round(height * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Kunne ikke tegne billede"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Kunne ikke konvertere billede"))),
        "image/jpeg",
        0.9,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Kunne ikke læse billede"));
    };
    img.src = url;
  });
}

export default function BeveragesPage() {
  const [list, setList] = useState<Beverage[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");
  const [beverageTypeId, setBeverageTypeId] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const [beveragesRes, typesRes, categoriesRes] = await Promise.all([
      getAllBeverages(),
      getAllTypes(),
      getAllCategories(),
    ]);
    const bevErr = (beveragesRes as { error?: { message?: string } }).error;
    if (bevErr) setError(bevErr.message || "Kunne ikke hente drikke");
    else setList(beveragesRes.data ?? []);
    if (typesRes.data) {
      setTypes(typesRes.data);
      const firstTypeId = typesRes.data?.[0]?.id;
      if (!beverageTypeId && firstTypeId) setBeverageTypeId(firstTypeId);
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const firstId = types[0]?.id;
    if (types.length && !beverageTypeId && firstId) setBeverageTypeId(firstId);
  }, [types, beverageTypeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !name.trim() || !beverageTypeId) return;
    setSubmitting(true);
    setError(null);

    let images: Array<{ url: string; type: ImageSlotType; width: number; height: number }> = [];

    if (imageFile) {
      try {
        const presignRes = await fetch(`${API_BASE}/upload/presign/beverage-images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uploads: [{ type: "THUMBNAIL" }, { type: "LARGE" }],
          }),
        });
        if (!presignRes.ok) {
          const errData = await presignRes.json().catch(() => ({}));
          throw new Error(errData.message || `Presign fejlede: ${presignRes.status}`);
        }
        const { uploads: presignUploads } = (await presignRes.json()) as {
          uploads: Array<{ uploadUrl: string; url: string; type: string; width: number; height: number }>;
        };
        const [thumbPresign, largePresign] = presignUploads;
        const [thumbBlob, largeBlob] = await Promise.all([
          resizeImageToBlob(imageFile, THUMBNAIL_SIZE, THUMBNAIL_SIZE),
          resizeImageToBlob(imageFile, LARGE_SIZE, LARGE_SIZE),
        ]);
        const [thumbPut, largePut] = await Promise.all([
          fetch(thumbPresign.uploadUrl, {
            method: "PUT",
            body: thumbBlob,
            headers: { "Content-Type": "image/jpeg" },
          }),
          fetch(largePresign.uploadUrl, {
            method: "PUT",
            body: largeBlob,
            headers: { "Content-Type": "image/jpeg" },
          }),
        ]);
        if (!thumbPut.ok) throw new Error(`Upload af thumbnail fejlede: ${thumbPut.status}`);
        if (!largePut.ok) throw new Error(`Upload af stor version fejlede: ${largePut.status}`);
        images = [
          { url: thumbPresign.url, type: "THUMBNAIL" as ImageSlotType, width: thumbPresign.width, height: thumbPresign.height },
          { url: largePresign.url, type: "LARGE" as ImageSlotType, width: largePresign.width, height: largePresign.height },
        ];
      } catch (err) {
        setError(err instanceof Error ? err.message : "Billedupload fejlede");
        setSubmitting(false);
        return;
      }
    }

    const createRes = await createBeverage({
      body: {
        beverageTypeId,
        brand: brand.trim(),
        name: name.trim(),
        country: country.trim() || undefined,
        ...(images.length ? { images } : {}),
      },
    });
    setSubmitting(false);
    const createErr = (createRes as { error?: { message?: string } }).error;
    if (createErr) {
      setError(createErr.message || "Kunne ikke oprette drikke");
      return;
    }
    setBrand("");
    setName("");
    setCountry("");
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  const typeMap = Object.fromEntries(types.map((t) => [t.id, t.name]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const typesInFilterCategory = useMemo(
    () => (filterCategoryId ? types.filter((t) => t.categoryId === filterCategoryId) : types),
    [types, filterCategoryId],
  );

  const filteredList = useMemo(() => {
    if (!filterCategoryId && !filterTypeId) return list;
    return list.filter((b) => {
      const type = b.beverageTypeId ? types.find((t) => t.id === b.beverageTypeId) : null;
      if (!type) return false;
      if (filterTypeId && b.beverageTypeId !== filterTypeId) return false;
      if (filterCategoryId && type.categoryId !== filterCategoryId) return false;
      return true;
    });
  }, [list, types, filterCategoryId, filterTypeId]);

  return (
    <div>
      <PageHeading>Drikke</PageHeading>

      <Card as="form" onSubmit={handleSubmit} className="mb-8">
        <SectionHeading className="mb-4">Opret ny drikke</SectionHeading>
        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Type</Label>
            <Select
              value={beverageTypeId}
              onChange={(e) => setBeverageTypeId(e.target.value)}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Mærke</Label>
            <Input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="fx Carlsberg"
            />
          </div>
          <div>
            <Label>Navn</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="fx Pilsner"
            />
          </div>
          <div>
            <Label>Land</Label>
            <Input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="fx DK"
            />
          </div>
          <div>
            <Label>Billede (valgfrit)</Label>
            <Input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
            {imageFile && (
              <span className="text-heading-muted ml-2 text-xs">{imageFile.name}</span>
            )}
            <p className="text-heading-muted mt-1 text-xs">
              Ét billede – skaleres automatisk til thumbnail (200×200) og stor version (800×800). JPEG, PNG, WebP eller GIF.
            </p>
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={submitting || !brand.trim() || !name.trim() || !beverageTypeId}
            >
              {submitting ? "Opretter…" : "Opret"}
            </Button>
          </div>
        </div>
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}

      <section className="mb-6">
        <SectionHeading className="mb-3">Filtre</SectionHeading>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label>Kategori</Label>
            <Select
              value={filterCategoryId}
              onChange={(e) => {
                setFilterCategoryId(e.target.value);
                setFilterTypeId("");
              }}
              className="text-sm"
            >
              <option value="">Alle kategorier</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={filterTypeId}
              onChange={(e) => setFilterTypeId(e.target.value)}
              className="text-sm"
            >
              <option value="">Alle typer</option>
              {typesInFilterCategory.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {categoryMap[t.categoryId ?? ""] ? ` (${categoryMap[t.categoryId ?? ""]})` : ""}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading>Eksisterende drikke</SectionHeading>
        {loading ? (
          <LoadingState />
        ) : filteredList.length === 0 ? (
          <EmptyState>
            {list.length === 0 ? "Ingen drikke endnu." : "Ingen drikke for valgte filter."}
          </EmptyState>
        ) : (
          <>
            <p className="text-heading-muted mb-2 text-sm">
              Viser {filteredList.length} drikke{filteredList.length !== 1 ? "varer" : "vare"}
            </p>
            <CardList>
              {filteredList.map((b) => (
                <CardListItem key={b.id}>
                  <div>
                    <AccentLink href={`/beverages/${encodeURIComponent(b.id ?? "")}`}>
                      {b.brand} – {b.name}
                    </AccentLink>
                    <span className="text-heading-muted ml-2 text-sm">
                      {b.beverageTypeId ? (typeMap[b.beverageTypeId] ?? b.beverageTypeId) : ""}
                    </span>
                    {b.country && (
                      <span className="text-heading-muted ml-2 text-sm">
                        ({b.country})
                      </span>
                    )}
                  </div>
                  <span className="text-heading-muted text-xs">
                    {b.averageRating != null ? `★ ${b.averageRating.toFixed(1)}` : ""} {b.reviewCount != null ? `(${b.reviewCount})` : ""}
                  </span>
                </CardListItem>
              ))}
            </CardList>
          </>
        )}
      </section>
    </div>
  );
}
