import { getApiBaseUrl } from "./api-client";
import { resizeImageToBlob, THUMBNAIL_SIZE, LARGE_SIZE } from "./resizeImage";

export type UploadedImageSlot = {
  url: string;
  type: "THUMBNAIL" | "LARGE";
  width: number;
  height: number;
};

/**
 * Presigner, skalerer og uploader et billede som thumbnail + stor version.
 * Returnerer de to image-slots til brug i beverage create/update. Kaster Error ved fejl.
 */
export async function uploadBeverageImage(file: File): Promise<UploadedImageSlot[]> {
  const presignRes = await fetch(`${getApiBaseUrl()}/api/admin/upload/presign/beverage-images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uploads: [{ type: "THUMBNAIL" }, { type: "LARGE" }] }),
  });
  if (!presignRes.ok) {
    const errData = (await presignRes.json().catch(() => ({}))) as { message?: string };
    throw new Error(errData.message || `Presign fejlede: ${presignRes.status}`);
  }
  const { uploads } = (await presignRes.json()) as {
    uploads: Array<{ uploadUrl: string; url: string; width: number; height: number }>;
  };
  const [thumbPresign, largePresign] = uploads;

  const [thumbBlob, largeBlob] = await Promise.all([
    resizeImageToBlob(file, THUMBNAIL_SIZE, THUMBNAIL_SIZE),
    resizeImageToBlob(file, LARGE_SIZE, LARGE_SIZE),
  ]);

  const put = (uploadUrl: string, blob: Blob) =>
    fetch(uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": "image/jpeg" } });
  const [thumbPut, largePut] = await Promise.all([
    put(thumbPresign.uploadUrl, thumbBlob),
    put(largePresign.uploadUrl, largeBlob),
  ]);
  if (!thumbPut.ok) throw new Error(`Upload af thumbnail fejlede: ${thumbPut.status}`);
  if (!largePut.ok) throw new Error(`Upload af stor version fejlede: ${largePut.status}`);

  return [
    { url: thumbPresign.url, type: "THUMBNAIL", width: thumbPresign.width, height: thumbPresign.height },
    { url: largePresign.url, type: "LARGE", width: largePresign.width, height: largePresign.height },
  ];
}
