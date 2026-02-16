"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Button, Input, TextField, SelectField, Label, Alert } from "@/app/components/ui";
import {
  getBrandsByCategory,
  findAttributesByCategory,
  createBeverage,
  getApiBaseUrl,
} from "@/lib/api-client";
import { getApiError } from "@/lib/hooks/useApiError";
import { resizeImageToBlob, THUMBNAIL_SIZE, LARGE_SIZE } from "@/lib/resizeImage";

type AttributeDefinition = {
  id: string;
  displayName: string;
  dataType: string;
  required?: boolean;
  typeIds?: string[];
  typeId?: unknown;
};

type Category = { id: string; name: string };
type Type = { id: string; name: string; categoryId: string };
type Brand = { id: string; name: string };

function defAppliesToType(def: AttributeDefinition, beverageTypeId: string): boolean {
  if (Array.isArray(def.typeIds)) return def.typeIds.length === 0 || def.typeIds.includes(beverageTypeId);
  const t = def.typeId as string | undefined;
  return t == null || t === "" || (typeof t === "string" && t === beverageTypeId);
}

function isAttributeValueEmpty(
  def: AttributeDefinition,
  value: string | number | boolean | undefined,
): boolean {
  if (value === undefined) return true;
  if (def.dataType === "string") return typeof value === "string" && !value.trim();
  if (def.dataType === "number") return value === "" || (typeof value === "number" && Number.isNaN(value));
  return false;
}

type CreatedBeverage = { id: string };

type Props = {
  categories: Category[];
  types: Type[];
  onSuccess: (beverage: CreatedBeverage) => void;
  onError?: (message: string) => void;
  /** Hvis sat, vises ingen wrapper-form – kun indhold (til indlejring i anden form). */
  noForm?: boolean;
};

export function BeverageCreateForm({ categories, types, onSuccess, onError, noForm }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [createCategoryId, setCreateCategoryId] = useState("");
  const [beverageTypeId, setBeverageTypeId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [attributeDefinitions, setAttributeDefinitions] = useState<AttributeDefinition[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, string | number | boolean | undefined>>({});
  const [brandsInCreateCategory, setBrandsInCreateCategory] = useState<Brand[]>([]);

  const typesInCreateCategory = useMemo(
    () => (createCategoryId ? types.filter((t) => t.categoryId === createCategoryId) : []),
    [types, createCategoryId],
  );

  useEffect(() => {
    if (!createCategoryId) {
      setBrandsInCreateCategory([]);
      setBrandId("");
      return;
    }
    let cancelled = false;
    getBrandsByCategory(createCategoryId).then((res) => {
      if (cancelled) return;
      const err = getApiError(res as { error?: unknown });
      if (err) setBrandsInCreateCategory([]);
      else setBrandsInCreateCategory((res.data as Brand[]) ?? []);
    });
    return () => { cancelled = true; };
  }, [createCategoryId]);

  useEffect(() => {
    if (!beverageTypeId) {
      setAttributeDefinitions([]);
      setAttributeValues({});
      return;
    }
    const selectedType = types.find((t) => t.id === beverageTypeId);
    if (!selectedType?.categoryId) return;
    let cancelled = false;
    findAttributesByCategory({ path: { categoryId: selectedType.categoryId } }).then((res) => {
      if (cancelled) return;
      const err = getApiError(res as { error?: unknown });
      if (err) {
        setAttributeDefinitions([]);
        return;
      }
      const all = (res.data ?? []) as AttributeDefinition[];
      const forType = all.filter((def) => defAppliesToType(def, beverageTypeId));
      setAttributeDefinitions(forType);
      setAttributeValues((prev) => {
        const next: Record<string, string | number | boolean | undefined> = {};
        for (const def of forType) {
          if (def.id in prev) next[def.id] = prev[def.id];
        }
        return next;
      });
    });
    return () => { cancelled = true; };
  }, [beverageTypeId, types]);

  useEffect(() => {
    const first = typesInCreateCategory[0]?.id;
    if (typesInCreateCategory.length && !beverageTypeId && first) setBeverageTypeId(first);
  }, [typesInCreateCategory, beverageTypeId]);
  useEffect(() => {
    const current = types.find((t) => t.id === beverageTypeId);
    if (createCategoryId && current && current.categoryId !== createCategoryId) setBeverageTypeId("");
  }, [createCategoryId, beverageTypeId, types]);
  useEffect(() => {
    const first = brandsInCreateCategory[0]?.id;
    if (brandsInCreateCategory.length && !brandId && first) setBrandId(first);
  }, [brandsInCreateCategory, brandId]);
  useEffect(() => {
    if (brandId && !brandsInCreateCategory.some((b) => b.id === brandId)) setBrandId("");
  }, [brandId, brandsInCreateCategory]);

  function setAttributeValue(defId: string, value: string | number | boolean | undefined) {
    setAttributeValues((prev) => ({ ...prev, [defId]: value }));
  }

  async function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault?.();
    if (!brandId || !name.trim() || !beverageTypeId) return;
    const requiredMissing = attributeDefinitions.filter(
      (def) => def.required && isAttributeValueEmpty(def, attributeValues[def.id]),
    );
    if (requiredMissing.length > 0) {
      const msg = `Påkrævede felter mangler: ${requiredMissing.map((d) => d.displayName).join(", ")}`;
      setErrorState(msg);
      onError?.(msg);
      return;
    }
    setSubmitting(true);
    setErrorState(null);
    onError?.("");

    type ImageSlot = { url: string; type: "THUMBNAIL" | "LARGE"; width: number; height: number };
    let images: ImageSlot[] = [];
    if (imageFile) {
      try {
        const presignRes = await fetch(`${getApiBaseUrl()}/api/admin/upload/presign/beverage-images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploads: [{ type: "THUMBNAIL" }, { type: "LARGE" }] }),
        });
        if (!presignRes.ok) {
          const errData = await presignRes.json().catch(() => ({}));
          throw new Error((errData as { message?: string }).message || `Presign fejlede: ${presignRes.status}`);
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
          { url: thumbPresign.url, type: "THUMBNAIL", width: thumbPresign.width, height: thumbPresign.height },
          { url: largePresign.url, type: "LARGE", width: largePresign.width, height: largePresign.height },
        ];
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Billedupload fejlede";
        setErrorState(msg);
        onError?.(msg);
        setSubmitting(false);
        return;
      }
    }

    const createRes = await createBeverage({
      body: {
        beverageTypeId,
        brandId,
        name: name.trim(),
        country: country.trim() || undefined,
        ...(images.length ? { images } : {}),
      },
    });
    setSubmitting(false);
    const createErr = getApiError(createRes as { error?: unknown });
    if (createErr) {
      setErrorState(createErr);
      onError?.(createErr);
      return;
    }
    const created = createRes.data as CreatedBeverage | undefined;
    if (created?.id) {
      setCreateCategoryId("");
      setBeverageTypeId("");
      setBrandId("");
      setName("");
      setCountry("");
      setImageFile(null);
      setAttributeValues({});
      imageInputRef.current && (imageInputRef.current.value = "");
      onSuccess(created);
    }
  }

  const showBrandsFilteredHint =
    createCategoryId && brandsInCreateCategory.length > 0;

  const content = (
    <>
      <div className="flex flex-wrap gap-4">
        <SelectField
          label="Kategori"
          value={createCategoryId}
          onChange={(e) => setCreateCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </SelectField>
        <SelectField
          label="Type"
          value={beverageTypeId}
          onChange={(e) => setBeverageTypeId(e.target.value)}
          disabled={!createCategoryId || typesInCreateCategory.length === 0}
        >
          <option value="">
            {createCategoryId
              ? typesInCreateCategory.length === 0
                ? "Ingen typer i kategorien"
                : "Vælg type"
              : "Vælg kategori først"}
          </option>
          {typesInCreateCategory.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </SelectField>
        <SelectField
          label="Mærke"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          disabled={!createCategoryId}
          helperText={showBrandsFilteredHint ? "Viser kun mærker tilladt i denne kategori" : undefined}
        >
          <option value="">
            {createCategoryId
              ? brandsInCreateCategory.length === 0
                ? "Ingen mærker tilladt i denne kategori"
                : "Vælg mærke"
              : "Vælg kategori først"}
          </option>
          {brandsInCreateCategory.map((br) => (
            <option key={br.id} value={br.id}>{br.name}</option>
          ))}
        </SelectField>
        <TextField
          label="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="fx Pilsner"
        />
        <TextField
          label="Land"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="fx DK"
        />
        {attributeDefinitions.map((def) => (
          <div key={def.id}>
            {def.dataType === "boolean" ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`bcf-attr-${def.id}`}
                  checked={(attributeValues[def.id] as boolean | undefined) ?? false}
                  onChange={(e) => setAttributeValue(def.id, e.target.checked)}
                  className="h-4 w-4 rounded border border-border"
                />
                <Label htmlFor={`bcf-attr-${def.id}`} className="mb-0!">
                  {def.displayName}
                  {def.required && <span className="text-red-500"> *</span>}
                </Label>
              </div>
            ) : (
              <TextField
                label={
                  <>
                    {def.displayName}
                    {def.required && <span className="text-red-500"> *</span>}
                  </>
                }
                id={`bcf-attr-${def.id}`}
                type={def.dataType === "number" ? "number" : "text"}
                value={String((attributeValues[def.id] as string | number | undefined) ?? "")}
                onChange={(e) => {
                  if (def.dataType === "number") {
                    const v = e.target.value;
                    setAttributeValue(def.id, v === "" ? undefined : Number(v));
                  } else {
                    setAttributeValue(def.id, e.target.value);
                  }
                }}
                placeholder={def.required ? "Påkrævet" : "Valgfrit"}
              />
            )}
          </div>
        ))}
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
            <span className="text-foreground-muted ml-2 text-xs">{imageFile.name}</span>
          )}
          <p className="text-foreground-muted mt-1 text-xs">
            Ét billede – skaleres automatisk til thumbnail (200×200) og stor version (800×800). JPEG, PNG, WebP eller GIF.
          </p>
        </div>
        <div className="flex items-center">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !brandId || !name.trim() || !beverageTypeId}
          >
            {submitting ? "Opretter…" : "Opret"}
          </Button>
        </div>
      </div>
      {error && <Alert className="mt-3">{error}</Alert>}
    </>
  );

  if (noForm) return <div>{content}</div>;
  return <form onSubmit={handleSubmit}>{content}</form>;
}
