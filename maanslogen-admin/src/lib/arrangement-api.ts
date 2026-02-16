/**
 * Arrangement (smagning) API – bruges indtil generate:api:live er kørt;
 * derefter kan hooks skifte til de genererede arrangementAdminController* funktioner.
 */
import { getApiBaseUrl } from "./api-client";

export type ArrangementType = "TASTING";

export interface ArrangementBeverageItem {
  id: string;
  sortOrder: number;
  beverage: {
    id: string;
    name: string;
    brand?: { name: string };
    averageRating?: number;
    reviewCount?: number;
    [key: string]: unknown;
  };
}

export interface Arrangement {
  id: string;
  type: ArrangementType;
  name: string;
  description?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  beverages?: ArrangementBeverageItem[];
}

export interface CreateArrangementBody {
  type: ArrangementType;
  name: string;
  description?: string;
  createdById: string;
  beverages: { beverageId: string; sortOrder: number }[];
}

export interface UpdateArrangementBody {
  name?: string;
  description?: string;
  beverages?: { beverageId: string; sortOrder: number }[];
}

const base = () => getApiBaseUrl();

async function handleRes<T>(res: Response): Promise<{ data?: T; error?: { message?: string } }> {
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    return { error: { message: res.statusText || "Request failed" } };
  }
  if (!res.ok) {
    return { error: typeof json === "object" && json !== null && "message" in (json as object) ? (json as { message?: string }) : { message: res.statusText } };
  }
  return { data: json as T };
}

export async function getAllArrangements(): Promise<{ data?: Arrangement[]; error?: { message?: string } }> {
  const res = await fetch(`${base()}/api/admin/arrangements`);
  return handleRes<Arrangement[]>(res);
}

export async function getArrangementById(id: string): Promise<{ data?: Arrangement; error?: { message?: string } }> {
  const res = await fetch(`${base()}/api/admin/arrangements/${encodeURIComponent(id)}`);
  return handleRes<Arrangement>(res);
}

export async function createArrangement(body: CreateArrangementBody): Promise<{ data?: Arrangement; error?: { message?: string } }> {
  const res = await fetch(`${base()}/api/admin/arrangements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes<Arrangement>(res);
}

export async function updateArrangement(id: string, body: UpdateArrangementBody): Promise<{ data?: Arrangement; error?: { message?: string } }> {
  const res = await fetch(`${base()}/api/admin/arrangements/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes<Arrangement>(res);
}

export async function deleteArrangement(id: string): Promise<{ data?: { deleted: boolean }; error?: { message?: string } }> {
  const res = await fetch(`${base()}/api/admin/arrangements/${encodeURIComponent(id)}`, { method: "DELETE" });
  return handleRes<{ deleted: boolean }>(res);
}
