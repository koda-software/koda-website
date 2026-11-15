import { MAX_JPK_FILE_BYTES, analyzeJpk, createJpkParser, type JpkOutcome } from "./jpk";

/** Messages from `jpk.worker.ts` to the page. */
export type JpkWorkerMessage = { type: "progress"; bytes: number } | { type: "done"; outcome: JpkOutcome };

/**
 * The charset from the XML declaration in the first bytes. JPK files are UTF-8, but some
 * older programs write windows-1250. The UTF-8 decoder strips a BOM by itself.
 */
export function detectEncoding(head: Uint8Array): string {
  const declaration = String.fromCharCode(...head.subarray(0, 200));
  const label = /encoding\s*=\s*["']([^"']+)["']/i.exec(declaration)?.[1].trim().toLowerCase();
  if (!label || label === "utf-8" || label === "utf8") return "utf-8";

  try {
    return new TextDecoder(label).encoding;
  } catch {
    return "utf-8";
  }
}

type ReadOptions = {
  onProgress?: (bytes: number) => void;
  /** On the main thread: give the page a frame after roughly this many bytes. */
  yieldEvery?: number;
  signal?: AbortSignal;
};

/**
 * Reads a JPK file as a stream, so the whole text is never held as one string, then
 * sums and checks it. The same code runs in the worker and, as a fallback, on the page.
 */
export async function readJpkFile(file: Blob, { onProgress, yieldEvery, signal }: ReadOptions = {}): Promise<JpkOutcome> {
  if (file.size > MAX_JPK_FILE_BYTES) return { kind: "error", reason: "tooLarge" };

  const parser = createJpkParser();
  let decoder: TextDecoder | null = null;
  let bytes = 0;
  let sinceYield = 0;

  try {
    const reader = file.stream().getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (signal?.aborted) {
        await reader.cancel();
        return { kind: "error", reason: "read" };
      }

      decoder ??= new TextDecoder(detectEncoding(value));
      parser.write(decoder.decode(value, { stream: true }));
      bytes += value.byteLength;
      onProgress?.(bytes);

      sinceYield += value.byteLength;
      if (yieldEvery && sinceYield >= yieldEvery) {
        sinceYield = 0;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    if (decoder) parser.write(decoder.decode());
  } catch {
    return { kind: "error", reason: "read" };
  }

  const result = parser.finish();
  return result.kind === "ok" ? { kind: "ok", analysis: analyzeJpk(result.jpk) } : result;
}
