"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  getBeverageById,
  getAllTypes,
  getBrandsByCategory,
  updateBeverage,
} from "@/lib/api-client";
import { useFetchAll, useFetch } from "@/lib/hooks";
import { getApiError } from "@/lib/hooks/useApiError";
import { uploadBeverageImage } from "@/lib/uploadBeverageImage";
import type { CreateImageDto } from "@/lib/api-client";
import type { Beverage, BeverageType } from "@/lib/api-client";
import {
  PageHeading,
  Card,
  Alert,
  LinkButton,
  Button,
  TextField,
  SelectField,
  Label,
  Input,
} from "@/app/components/ui";
import { BackLink, IconTrash } from "@/app/components/layout";
import { LoadingState } from "@/app/components/data";

type ImageSlot = { url: string; type: "THUMBNAIL" | "LARGE"; width?: number; height?: number };

function imageFromItem(img: { url: string; type: string; width?: unknown; height?: unknown }): ImageSlot {
  return {
    url: img.url,
    type: img.type as "THUMBNAIL" | "LARGE",
    width: typeof img.width === "number" ? img.width : undefined,
    height: typeof img.height === "number" ? img.height : undefined,
  };
}

export function BeverageEditClient() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error } = useFetchAll(
    [() => getBeverageById({ path: { id } }), () => getAllTypes()],
    [id],
    { enabled: !!id },
  );

  const [item, types] = (data ?? [null, null]) as [Beverage | null, BeverageType[] | null];

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [beverageTypeId, setBeverageTypeId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editCategoryId = useMemo(
    () => (beverageTypeId && types ? types.find((t) => t.id === beverageTypeId)?.categoryId : undefined),
    [beverageTypeId, types],
  );
  const { data: editBrandsData } = useFetch(
    () => getBrandsByCategory(editCategoryId!),
    [editCategoryId],
    { enabled: !!editCategoryId },
  );
  const brandsForSelect = (editBrandsData ?? []) as Array<{ id: string; name: string }>;

  useEffect(() => {
    if (item) {
      setName(item.name ?? "");
      setCountry(item.country ?? "");
      setBeverageTypeId(item.beverageTypeId ?? "");
      setBrandId(item.brandId ?? (typeof item.brand === "object" && item.brand?.id ? item.brand.id : "") ?? "");
      setImages((item.images ?? []).map(imageFromItem));
    }
  }, [item]);

  useEffect(() => {
    if (editCategoryId && brandId && !brandsForSelect.some((b) => b.id === brandId)) setBrandId("");
  }, [editCategoryId, brandId, brandsForSelect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !brandId || !beverageTypeId) return;
    setSubmitting(true);
    setSubmitError(null);
    const body: Parameters<typeof updateBeverage>[0]["body"] = {
      name: name.trim(),
      country: country.trim() || undefined,
      brandId,
      beverageTypeId,
      images: images as CreateImageDto[],
    };
    const res = await updateBeverage({ path: { id }, body });
    setSubmitting(false);
    const err = getApiError(res);
    if (err) {
      setSubmitError(err);
      return;
    }
    router.push(`/beverages/${id}`);
  }

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setUploadingImage(true);
    try {
      const uploaded = await uploadBeverageImage(file);
      setImages((prev) => [...prev, ...uploaded]);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Billedupload fejlede");
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img.url !== url));
  }

  if (loading) {
    return (
      <div>
        <BackLink href={`/beverages/${id}`}>← Tilbage til drikkevare</BackLink>
        <LoadingState />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div>
        <BackLink href="/beverages">← Tilbage til drikkevarer</BackLink>
        <Alert>{error ?? "Drikkevare ikke fundet"}</Alert>
      </div>
    );
  }

  return (
    <div>
      <BackLink href={`/beverages/${id}`}>← Tilbage til drikkevare</BackLink>
      <PageHeading>Rediger drikkevare</PageHeading>
      {submitError && <Alert className="mb-4">{submitError}</Alert>}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4">
            <SelectField
              label="Type"
              value={beverageTypeId}
              onChange={(e) => setBeverageTypeId(e.target.value)}
            >
              <option value="">Vælg type</option>
              {types?.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </SelectField>
            <SelectField
              label="Mærke"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              disabled={!editCategoryId}
            >
              <option value="">Vælg mærke</option>
              {brandsForSelect.map((br) => (
                <option key={br.id} value={br.id}>{br.name}</option>
              ))}
            </SelectField>
          </div>
          <TextField
            label="Navn"
            id="beverage-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="fx Pilsner"
          />
          <TextField
            label="Land"
            id="beverage-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="fx DK"
          />

          <div>
            <Label>Billeder</Label>
            {images.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-3">
                {images.map((img) => (
                  <li key={img.url} className="flex items-center gap-2 rounded border border-border bg-muted/30 p-2">
                    {img.type === "THUMBNAIL" && (
                      <img src={img.url} alt="" className="h-12 w-12 object-cover rounded" />
                    )}
                    {img.type === "LARGE" && (
                      <img src={img.url} alt="" className="h-12 w-20 object-cover rounded" />
                    )}
                    <span className="text-foreground-muted text-xs">{img.type}</span>
                    <Button
                      type="button"
                      variant="accent"
                      aria-label="Fjern billede"
                      onClick={() => removeImage(img.url)}
                      disabled={submitting}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2">
              <Input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAddImage}
                disabled={uploadingImage}
                className="text-sm"
              />
              {uploadingImage && <span className="text-foreground-muted text-sm">Uploader…</span>}
            </div>
            {imageError && <p className="text-destructive mt-1 text-sm">{imageError}</p>}
            <p className="text-foreground-muted mt-1 text-xs">
              Tilføj billede – skaleres til thumbnail og stor version. JPEG, PNG, WebP eller GIF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting || !name.trim() || !brandId || !beverageTypeId}>
              {submitting ? "Gemmer…" : "Gem"}
            </Button>
            <LinkButton href={`/beverages/${id}`} variant="secondary">
              Annuller
            </LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
