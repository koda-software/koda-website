/**
 * Opero file ids are opaque (cuid or uuid); files are private, so every image
 * is served through the authenticated proxy at `/api/blog/image/[fileId]`.
 */
export const fileIdPattern = /^[a-z0-9-]{10,40}$/i;

export function isFileId(value: unknown): value is string {
  return typeof value === "string" && fileIdPattern.test(value);
}

export function blogImagePath(fileId: string) {
  return `/api/blog/image/${fileId}`;
}

/** Returns a proxy URL for a CMS file id, or `null` when the field is empty. */
export function blogImageSrc(fileId: string | null | undefined): string | null {
  return isFileId(fileId) ? blogImagePath(fileId) : null;
}
