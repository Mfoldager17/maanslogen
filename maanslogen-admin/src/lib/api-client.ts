/**
 * Configure generated API client and re-export SDK + types.
 * Generated from OpenAPI/Swagger. Run:
 *   npm run generate:api         — from local openapi.json
 *   npm run generate:api:live    — from running API (http://localhost:9090/api/swagger-json)
 * After adding endpoints/models in the API, run generate:api:live; new functions and types
 * are then available here automatically (no manual exports needed).
 */
import { client } from "./api/client.gen";

// I browser: brug URL fra server (window.__MAANSLOGEN_API_URL__), ellers fallback til public API når origin er mathiasfoldager.com.
const PUBLIC_API_URL = "https://maanslogen-dev-api.mathiasfoldager.com";

function resolveBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
  }
  // Når admin kører på mathiasfoldager.com, brug altid public API (ignorer injiceret localhost/192.168)
  if (window.location.hostname.endsWith("mathiasfoldager.com")) {
    return PUBLIC_API_URL;
  }
  const injected = (window as unknown as { __MAANSLOGEN_API_URL__?: string }).__MAANSLOGEN_API_URL__;
  if (injected) return injected;
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
}

const baseUrl = resolveBaseUrl();
client.setConfig({ baseUrl: baseUrl as `${string}://${string}` });

/** API base URL (bruger runtime-værdi fra .env.dev i Docker). */
export function getApiBaseUrl(): string {
  return resolveBaseUrl();
}

// Nice aliases (optional – you can also use the generated names from the export * below)
export {
  attributeDefinitionAdminControllerCreate as createAttribute,
  attributeDefinitionAdminControllerFindAll as findAllAttributes,
  attributeDefinitionAdminControllerFindByCategory as findAttributesByCategory,
  attributeDefinitionAdminControllerGetById as getAttributeById,
  attributeDefinitionAdminControllerUpdate as updateAttribute,
  attributeDefinitionAdminControllerRemove as deleteAttribute,
  beverageAdminControllerCreate as createBeverage,
  beverageAdminControllerGetAll as getAllBeverages,
  beverageAdminControllerGetById as getBeverageById,
  beverageAdminControllerUpdate as updateBeverage,
  beverageAdminControllerRemove as deleteBeverage,
  beverageCategoryAdminControllerCreate as createCategory,
  beverageCategoryAdminControllerGetAll as getAllCategories,
  beverageCategoryAdminControllerGetById as getCategoryById,
  beverageCategoryAdminControllerUpdate as updateCategory,
  beverageCategoryAdminControllerRemove as deleteCategory,
  beverageTypeAdminControllerCreate as createType,
  beverageTypeAdminControllerGetAll as getAllTypes,
  beverageTypeAdminControllerGetById as getTypeById,
  beverageTypeAdminControllerUpdate as updateType,
  beverageTypeAdminControllerRemove as deleteType,
  brandAdminControllerCreate as createBrand,
  brandAdminControllerGetAll as getAllBrands,
  brandAdminControllerGetById as getBrandById,
  brandAdminControllerUpdate as updateBrand,
  brandAdminControllerRemove as deleteBrand,
  questionAdminControllerCreate as createQuestion,
  questionAdminControllerFindAll as findAllQuestions,
  questionAdminControllerFindByCategory as findQuestionsByCategory,
  questionAdminControllerFindByType as findQuestionsByType,
  questionAdminControllerGetById as getQuestionById,
  questionAdminControllerUpdate as updateQuestion,
  questionAdminControllerRemove as deleteQuestion,
  reviewAdminControllerCreate as createReview,
  reviewAdminControllerGetAll as getAllReviews,
  reviewAdminControllerGetById as getReviewById,
  reviewAdminControllerUpdate as updateReview,
  reviewAdminControllerRemove as deleteReview,
  type Options,
} from "./api/sdk.gen";

/** Get brands allowed in this category (until generate:api:live adds brandAdminControllerGetByCategory). */
export async function getBrandsByCategory(categoryId: string) {
  return client.get<unknown>({ url: `/api/admin/brands/category/${encodeURIComponent(categoryId)}` });
}

// All generated SDK functions (new endpoints appear here after generate:api:live)
export * from "./api/sdk.gen";

// All generated types (new models/DTOs appear here after generate:api:live)
export type * from "./api/types.gen";
