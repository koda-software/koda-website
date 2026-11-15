/**
 * Parses a dropped JPK file off the main thread, so a 100 MB file never freezes the tab.
 * The page creates it with `new Worker(new URL("…/jpk.worker.ts", import.meta.url))`.
 * Nothing here touches the network: the file arrives by `postMessage` and the result
 * goes back the same way.
 */
import { readJpkFile, type JpkWorkerMessage } from "./jpk-read";

/* Typed by hand: the project's lib is "dom", and the webworker lib would clash with it. */
type WorkerScope = {
  postMessage(message: JpkWorkerMessage): void;
  onmessage: ((event: MessageEvent<{ file: File }>) => void) | null;
};

const scope = self as unknown as WorkerScope;
const PROGRESS_STEP = 2 * 1024 * 1024;

scope.onmessage = async (event) => {
  let reported = 0;
  const outcome = await readJpkFile(event.data.file, {
    onProgress(bytes) {
      if (bytes - reported < PROGRESS_STEP) return;
      reported = bytes;
      scope.postMessage({ type: "progress", bytes });
    },
  });
  scope.postMessage({ type: "done", outcome });
};
