/**
 * Extract error message from API response shape { data?, error? }.
 * Use after calling SDK functions that return { data, error }.
 */
export function getApiError(res: { error?: unknown }): string | null {
  const err = res.error;
  if (err == null) return null;
  if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  return "Der opstod en fejl";
}
