/**
 * FAQ answers are stored as plain text in Opero, with a small set of inline
 * HTML allowed so answers can keep their links:
 *
 *   <a href="…">, <strong>/<b>, <em>/<i>, <br>, and <p> or a blank line
 *   between paragraphs.
 *
 * Anything else is dropped, but its text is kept; `<script>` and `<style>`
 * lose their content too. The answer is parsed into a small tree instead of
 * being injected as HTML, so the page never renders markup it did not allow.
 */

export type FaqInline =
  | { type: "text"; text: string }
  | { type: "br" }
  | { type: "strong" | "em"; children: FaqInline[] }
  | { type: "link"; href: string; children: FaqInline[] };

/** One paragraph of an answer. */
export type FaqParagraph = FaqInline[];

/** An open element while parsing. `plain` is a link whose href was refused: its text stays, unlinked. */
type Container = { type: "root" | "plain" | "strong" | "em" | "link"; tag: string; href?: string; children: FaqInline[] };

const inlineTags: Record<string, "strong" | "em"> = { strong: "strong", b: "strong", em: "em", i: "em" };
const droppedContentTags = new Set(["script", "style"]);
const tokenPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>|\n[ \t]*\n\s*|[^<\n]+|\n|</g;
const hrefPattern = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;

const namedEntities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code = entity[1] === "x" || entity[1] === "X" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }

    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

/** Web, mail and phone links, and paths on this site. Everything else (javascript:, data:…) is refused. */
export function safeHref(raw: string): string | null {
  const href = decodeEntities(raw).trim();

  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^[/#]/.test(href) && !href.startsWith("//")) return href;

  return null;
}

/** Parses an answer into paragraphs of allowed inline nodes. Empty paragraphs are dropped. */
export function parseFaqAnswer(source: string): FaqParagraph[] {
  const paragraphs: FaqParagraph[] = [];
  let stack: Container[] = [];
  let skipping: string | null = null;

  const startParagraph = () => {
    stack = [{ type: "root", tag: "", children: [] }];
  };

  const closeAll = () => {
    while (stack.length > 1) close(stack[stack.length - 1].tag);
  };

  // Tags still open at a paragraph break close there, so their text stays in this paragraph.
  const endParagraph = () => {
    closeAll();
    const trimmed = trimInline(stack[0].children);
    if (trimmed.length > 0) paragraphs.push(trimmed);
    startParagraph();
  };

  const append = (node: FaqInline) => {
    const top = stack[stack.length - 1];
    const last = top.children[top.children.length - 1];

    if (node.type === "text" && last?.type === "text") {
      // Spaces left around dropped tags collapse, as they would in HTML; &nbsp; is kept.
      last.text = (last.text + node.text).replace(/[ \t\n]{2,}/g, " ");
    } else {
      top.children.push(node);
    }
  };

  const close = (tag: string) => {
    let index = stack.length - 1;
    while (index > 0 && stack[index].tag !== tag) index -= 1;
    // A closing tag that was never opened is ignored.
    if (index < 1) return;

    while (stack.length > index) {
      const entry = stack.pop()!;

      if (entry.children.length === 0) continue;

      if (entry.type === "plain") {
        entry.children.forEach(append);
      } else if (entry.type === "link") {
        append({ type: "link", href: entry.href!, children: entry.children });
      } else if (entry.type === "strong" || entry.type === "em") {
        append({ type: entry.type, children: entry.children });
      }
    }
  };

  startParagraph();

  for (const match of source.matchAll(tokenPattern)) {
    const [token, closing, rawName, attributes] = match;
    const name = rawName?.toLowerCase();

    if (skipping) {
      if (closing && name === skipping) skipping = null;
      continue;
    }

    if (!name) {
      // Text: a blank line ends the paragraph, a single newline is a space.
      if (/^\n[ \t]*\n/.test(token)) endParagraph();
      else append({ type: "text", text: token === "\n" ? " " : decodeEntities(token) });
      continue;
    }

    if (droppedContentTags.has(name)) {
      if (!closing) skipping = name;
      continue;
    }

    if (name === "p") {
      endParagraph();
      continue;
    }

    if (name === "br") {
      append({ type: "br" });
      continue;
    }

    if (closing) {
      close(name);
      continue;
    }

    if (inlineTags[name]) {
      stack.push({ type: inlineTags[name], tag: name, children: [] });
      continue;
    }

    if (name === "a") {
      const href = hrefPattern.exec(attributes ?? "");
      const safe = href ? safeHref(href[1] ?? href[2] ?? href[3] ?? "") : null;
      // A refused link is still tracked, so its closing tag pairs up and its text stays.
      stack.push(safe ? { type: "link", tag: "a", href: safe, children: [] } : { type: "plain", tag: "a", children: [] });
      continue;
    }
    // Any other tag is dropped; its text stays.
  }

  endParagraph();

  return paragraphs;
}

/** Drops whitespace at the paragraph edges so stray spaces and newlines do not render. */
function trimInline(nodes: FaqInline[]): FaqInline[] {
  const result = [...nodes];
  const first = result[0];

  if (first?.type === "text") result[0] = { type: "text", text: first.text.trimStart() };

  const lastIndex = result.length - 1;
  const last = result[lastIndex];

  if (last?.type === "text") result[lastIndex] = { type: "text", text: last.text.trimEnd() };

  return result.filter((node) => node.type !== "text" || node.text.length > 0);
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineToHtml(nodes: FaqInline[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return escapeHtml(node.text);
        case "br":
          return "<br>";
        case "link":
          return `<a href="${escapeHtml(node.href)}">${inlineToHtml(node.children)}</a>`;
        default:
          return `<${node.type}>${inlineToHtml(node.children)}</${node.type}>`;
      }
    })
    .join("");
}

/** Clean HTML for the FAQPage `acceptedAnswer.text`, which Google reads with links and paragraphs. */
export function faqAnswerHtml(paragraphs: FaqParagraph[]): string {
  if (paragraphs.length === 1) return inlineToHtml(paragraphs[0]);

  return paragraphs.map((paragraph) => `<p>${inlineToHtml(paragraph)}</p>`).join("");
}
