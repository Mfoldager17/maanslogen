/** Scale image to max width/height (aspect ratio preserved) and return as JPEG blob. */
export function resizeImageToBlob(
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<Blob> {
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

export const THUMBNAIL_SIZE = 200;
export const LARGE_SIZE = 800;
