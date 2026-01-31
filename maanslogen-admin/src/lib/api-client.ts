/**
 * Configure generated API client and re-export SDK + types.
 * Generated from OpenAPI/Swagger. Run:
 *   npm run generate:api         — from local openapi.json
 *   npm run generate:api:live    — from running API (http://localhost:3000/swagger-json)
 * After adding endpoints/models in the API, run generate:api:live; new functions and types
 * are then available here automatically (no manual exports needed).
 */
import { client } from "./api/client.gen";

const baseUrl =
  (typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) || "http://localhost:3000";

client.setConfig({ baseUrl: baseUrl as `${string}://${string}` });

// Nice aliases (optional – you can also use the generated names from the export * below)
export {
  attributeDefinitionAdminControllerCreate as createAttribute,
  attributeDefinitionAdminControllerFindAll as findAllAttributes,
  attributeDefinitionAdminControllerFindByCategory as findAttributesByCategory,
  attributeDefinitionAdminControllerGetById as getAttributeById,
  beverageAdminControllerCreate as createBeverage,
  beverageAdminControllerGetAll as getAllBeverages,
  beverageAdminControllerGetById as getBeverageById,
  beverageCategoryAdminControllerCreate as createCategory,
  beverageCategoryAdminControllerGetAll as getAllCategories,
  beverageCategoryAdminControllerGetById as getCategoryById,
  beverageTypeAdminControllerCreate as createType,
  beverageTypeAdminControllerGetAll as getAllTypes,
  beverageTypeAdminControllerGetById as getTypeById,
  brandAdminControllerGetAll as getAllBrands,
  brandAdminControllerGetById as getBrandById,
  questionAdminControllerCreate as createQuestion,
  questionAdminControllerFindAll as findAllQuestions,
  questionAdminControllerFindByCategory as findQuestionsByCategory,
  questionAdminControllerFindByType as findQuestionsByType,
  questionAdminControllerGetById as getQuestionById,
  questionAdminControllerRemove as deleteQuestion,
  reviewAdminControllerCreate as createReview,
  reviewAdminControllerGetAll as getAllReviews,
  reviewAdminControllerGetById as getReviewById,
  type Options,
} from "./api/sdk.gen";

// All generated SDK functions (new endpoints appear here after generate:api:live)
export * from "./api/sdk.gen";

// All generated types (new models/DTOs appear here after generate:api:live)
export type * from "./api/types.gen";
