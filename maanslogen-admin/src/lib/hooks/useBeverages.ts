"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  getAllBeverages,
  getAllTypes,
  getAllCategories,
  getAllBrands,
  createBeverage,
  findAttributesByCategory,
  type Beverage,
  type BeverageType,
  type BeverageCategory,
  type Brand,
  type AttributeDefinition,
} from "@/lib/api-client";
import { getApiError } from "./useApiError";
import { resizeImageToBlob, THUMBNAIL_SIZE, LARGE_SIZE } from "@/lib/resizeImage";

function defTypeId(def: AttributeDefinition): string | undefined {
  const t = (def as { typeId?: string }).typeId;
  return typeof t === "string" ? t : undefined;
}

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")
    : "http://localhost:3000";

type ImageSlot = { url: string; type: "THUMBNAIL" | "LARGE"; width: number; height: number };

export function useBeverages() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [list, setList] = useState<Beverage[]>([]);
  const [types, setTypes] = useState<BeverageType[]>([]);
  const [categories, setCategories] = useState<BeverageCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");
  const [beverageTypeId, setBeverageTypeId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attributeDefinitions, setAttributeDefinitions] = useState<AttributeDefinition[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<string, string | number | boolean | undefined>>({});

  const selectedType = useMemo(
    () => types.find((t) => t.id === beverageTypeId),
    [types, beverageTypeId],
  );

  useEffect(() => {
    if (!selectedType?.categoryId) {
      setAttributeDefinitions([]);
      setAttributeValues({});
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await findAttributesByCategory({ path: { categoryId: selectedType.categoryId } });
      if (cancelled) return;
      const err = getApiError(res);
      if (err) {
        setAttributeDefinitions([]);
        return;
      }
      const all = (res.data ?? []) as AttributeDefinition[];
      const forType = all.filter(
        (def) => !defTypeId(def) || defTypeId(def) === beverageTypeId,
      );
      setAttributeDefinitions(forType);
      setAttributeValues((prev) => {
        const next: Record<string, string | number | boolean | undefined> = {};
        for (const def of forType) {
          if (def.id in prev) next[def.id] = prev[def.id];
        }
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedType?.categoryId, beverageTypeId]);

  function setAttributeValue(defId: string, value: string | number | boolean | undefined) {
    setAttributeValues((prev) => ({ ...prev, [defId]: value }));
  }

  async function load() {
    setLoading(true);
    setError(null);
    const [beveragesRes, typesRes, categoriesRes, brandsRes] = await Promise.all([
      getAllBeverages(),
      getAllTypes(),
      getAllCategories(),
      getAllBrands(),
    ]);
    const bevErr = getApiError(beveragesRes);
    if (bevErr) setError(bevErr);
    else setList(beveragesRes.data ?? []);
    if (typesRes.data) {
      setTypes(typesRes.data);
      setBeverageTypeId((prev) => prev || (typesRes.data?.[0]?.id ?? ""));
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (brandsRes.data) {
      setBrands(brandsRes.data);
      setBrandId((prev) => prev || (brandsRes.data?.[0]?.id ?? ""));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const firstId = types[0]?.id;
    if (types.length && !beverageTypeId && firstId) setBeverageTypeId(firstId);
  }, [types, beverageTypeId]);
  useEffect(() => {
    const firstId = brands[0]?.id;
    if (brands.length && !brandId && firstId) setBrandId(firstId);
  }, [brands, brandId]);

  const typeMap = useMemo(() => Object.fromEntries(types.map((t) => [t.id, t.name])), [types]);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);
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

  function isAttributeValueEmpty(def: AttributeDefinition, value: string | number | boolean | undefined): boolean {
    if (value === undefined) return true;
    if (def.dataType === "string") return typeof value === "string" && !value.trim();
    if (def.dataType === "number") return value === "" || (typeof value === "number" && Number.isNaN(value));
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brandId || !name.trim() || !beverageTypeId) return;
    const requiredMissing = attributeDefinitions.filter(
      (def) => def.required && isAttributeValueEmpty(def, attributeValues[def.id]),
    );
    if (requiredMissing.length > 0) {
      const names = requiredMissing.map((d) => d.displayName).join(", ");
      setError(`Påkrævede felter mangler: ${names}`);
      return;
    }
    setSubmitting(true);
    setError(null);

    let images: ImageSlot[] = [];
    if (imageFile) {
      try {
        const presignRes = await fetch(`${API_BASE}/api/admin/upload/presign/beverage-images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploads: [{ type: "THUMBNAIL" }, { type: "LARGE" }] }),
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
          { url: thumbPresign.url, type: "THUMBNAIL", width: thumbPresign.width, height: thumbPresign.height },
          { url: largePresign.url, type: "LARGE", width: largePresign.width, height: largePresign.height },
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
        brandId,
        name: name.trim(),
        country: country.trim() || undefined,
        ...(images.length ? { images } : {}),
      },
    });
    setSubmitting(false);
    const createErr = getApiError(createRes);
    if (createErr) {
      setError(createErr);
      return;
    }
    setBrandId("");
    setName("");
    setCountry("");
    setImageFile(null);
    setAttributeValues({});
    imageInputRef.current && (imageInputRef.current.value = "");
    if (createRes.data) setList((prev) => [...prev, createRes.data]);
  }

  function beverageBrandName(b: Beverage): string {
    return typeof b.brand === "object" && b.brand?.name != null
      ? b.brand.name
      : (b as { brand?: string }).brand ?? "";
  }

  return {
    list,
    types,
    categories,
    brands,
    loading,
    error,
    filterCategoryId,
    setFilterCategoryId,
    filterTypeId,
    setFilterTypeId,
    beverageTypeId,
    setBeverageTypeId,
    brandId,
    setBrandId,
    name,
    setName,
    country,
    setCountry,
    imageFile,
    setImageFile,
    submitting,
    imageInputRef,
    attributeDefinitions,
    attributeValues,
    setAttributeValue,
    typeMap,
    categoryMap,
    typesInFilterCategory,
    filteredList,
    handleSubmit,
    beverageBrandName,
  };
}
