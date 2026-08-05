import type { CSSProperties, ReactNode } from "react";
import { blogImageSrc } from "./images";
import type { TiptapMark, TiptapNode, TiptapPayload } from "./types";

/**
 * Server-only walker over the Tiptap document Opero stores for rich-text
 * fields. Unknown nodes degrade to their children and a malformed payload falls
 * back to `plainText` — rendering content must never throw on a live page.
 */

const warnedTypes = new Set<string>();

function warnOnce(kind: "node" | "mark", type: string) {
  const key = `${kind}:${type}`;

  if (warnedTypes.has(key)) return;
  warnedTypes.add(key);
  console.warn(`[blog/tiptap] unsupported ${kind} type "${type}" — rendering children only.`);
}

function attrString(attrs: TiptapNode["attrs"], key: string): string | null {
  const value = attrs?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function attrNumber(attrs: TiptapNode["attrs"], key: string): number | null {
  const value = attrs?.[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function textAlignStyle(attrs: TiptapNode["attrs"]): CSSProperties | undefined {
  const align = attrString(attrs, "textAlign");

  if (align === "center" || align === "right" || align === "justify") {
    return { textAlign: align };
  }

  return undefined;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?kodasoft\.pl/i.test(href);
}

function applyMark(mark: TiptapMark, children: ReactNode, key: string): ReactNode {
  switch (mark.type) {
    case "bold":
    case "strong":
      return <strong key={key}>{children}</strong>;
    case "italic":
    case "em":
      return <em key={key}>{children}</em>;
    case "strike":
      return <s key={key}>{children}</s>;
    case "underline":
      return <u key={key}>{children}</u>;
    case "code":
      return <code key={key}>{children}</code>;
    case "superscript":
      return <sup key={key}>{children}</sup>;
    case "subscript":
      return <sub key={key}>{children}</sub>;
    case "highlight":
      return <mark key={key}>{children}</mark>;
    case "textStyle":
    case "textColor": {
      const color = attrString(mark.attrs, "color");
      return color ? (
        <span key={key} style={{ color }}>
          {children}
        </span>
      ) : (
        <span key={key}>{children}</span>
      );
    }
    case "link": {
      const href = attrString(mark.attrs, "href");

      if (!href) return <span key={key}>{children}</span>;

      const external = isExternalHref(href);

      return (
        <a
          key={key}
          href={href}
          target={external ? (attrString(mark.attrs, "target") ?? "_blank") : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    default:
      warnOnce("mark", mark.type);
      return <span key={key}>{children}</span>;
  }
}

function renderChildren(nodes: TiptapNode[] | null | undefined, keyPrefix: string): ReactNode[] {
  if (!Array.isArray(nodes)) return [];

  return nodes.map((node, index) => renderNode(node, `${keyPrefix}-${index}`)).filter((child) => child !== null);
}

function hasVisibleContent(node: TiptapNode): boolean {
  if (typeof node.text === "string" && node.text.trim() !== "") return true;
  if (node.type === "image" || node.type === "hardBreak" || node.type === "horizontalRule") return true;
  return (node.content ?? []).some(hasVisibleContent);
}

function renderNode(node: TiptapNode | null | undefined, key: string): ReactNode {
  if (!node || typeof node.type !== "string") return null;

  switch (node.type) {
    case "doc":
      return <>{renderChildren(node.content, key)}</>;

    case "text": {
      const text = node.text ?? "";
      const marks = node.marks ?? [];

      return marks.reduce<ReactNode>(
        (children, mark, index) => applyMark(mark, children, `${key}-m${index}`),
        text,
      );
    }

    case "paragraph": {
      // Editors leave trailing empty paragraphs behind; they add stray gaps.
      if (!hasVisibleContent(node)) return null;

      return (
        <p key={key} style={textAlignStyle(node.attrs)}>
          {renderChildren(node.content, key)}
        </p>
      );
    }

    case "heading": {
      // The page already owns the h1, so body headings start at h2. Editors use
      // level 2 as their top body heading, so levels map across 1:1 from there —
      // shifting them down instead would skip a level and break heading order.
      const level = Math.min(6, Math.max(2, attrNumber(node.attrs, "level") ?? 2));
      const Heading = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";

      return (
        <Heading key={key} style={textAlignStyle(node.attrs)}>
          {renderChildren(node.content, key)}
        </Heading>
      );
    }

    case "bulletList":
      return <ul key={key}>{renderChildren(node.content, key)}</ul>;

    case "orderedList": {
      const start = attrNumber(node.attrs, "start");
      return (
        <ol key={key} start={start && start !== 1 ? start : undefined}>
          {renderChildren(node.content, key)}
        </ol>
      );
    }

    case "listItem":
      return <li key={key}>{renderChildren(node.content, key)}</li>;

    case "taskList":
      return (
        <ul key={key} className="blog-task-list">
          {renderChildren(node.content, key)}
        </ul>
      );

    case "taskItem":
      return (
        <li key={key}>
          <input type="checkbox" checked={node.attrs?.checked === true} disabled readOnly />
          <span>{renderChildren(node.content, key)}</span>
        </li>
      );

    case "blockquote":
      return <blockquote key={key}>{renderChildren(node.content, key)}</blockquote>;

    case "codeBlock":
      return (
        <pre key={key}>
          <code data-language={attrString(node.attrs, "language") ?? undefined}>
            {renderChildren(node.content, key)}
          </code>
        </pre>
      );

    case "table":
      return (
        <div className="overflow-x-auto" key={key}>
          <table>
            <tbody>{renderChildren(node.content, key)}</tbody>
          </table>
        </div>
      );

    case "tableRow":
      return <tr key={key}>{renderChildren(node.content, key)}</tr>;

    case "tableHeader":
      return (
        <th key={key} colSpan={attrNumber(node.attrs, "colspan") ?? undefined} rowSpan={attrNumber(node.attrs, "rowspan") ?? undefined}>
          {renderChildren(node.content, key)}
        </th>
      );

    case "tableCell":
      return (
        <td key={key} colSpan={attrNumber(node.attrs, "colspan") ?? undefined} rowSpan={attrNumber(node.attrs, "rowspan") ?? undefined}>
          {renderChildren(node.content, key)}
        </td>
      );

    case "image": {
      const src = blogImageSrc(attrString(node.attrs, "fileId") ?? attrString(node.attrs, "src"));

      if (!src) return null;

      const caption = attrString(node.attrs, "caption") ?? attrString(node.attrs, "title");
      const align = attrString(node.attrs, "align");
      const width = attrNumber(node.attrs, "width");
      const height = attrNumber(node.attrs, "height");

      return (
        <figure key={key} style={align === "center" || align === "right" ? { textAlign: align } : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element -- images are proxied originals; next/image optimization is disabled site-wide */}
          <img
            src={src}
            alt={attrString(node.attrs, "alt") ?? ""}
            width={width ?? undefined}
            height={height ?? undefined}
            loading="lazy"
            decoding="async"
          />
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    }

    case "hardBreak":
      return <br key={key} />;

    case "horizontalRule":
      return <hr key={key} />;

    default:
      warnOnce("node", node.type);
      return <span key={key}>{renderChildren(node.content, key)}</span>;
  }
}

/** Last-resort rendering when `doc` is missing or unusable. */
function renderPlainText(plainText: string | null | undefined): ReactNode {
  if (!plainText) return null;

  return (
    <>
      {plainText
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => (
          <p key={`plain-${index}`}>{line}</p>
        ))}
    </>
  );
}

export function renderTiptap(payload: TiptapPayload | null | undefined): ReactNode {
  if (!payload) return null;

  if (!payload.doc || typeof payload.doc !== "object") {
    return renderPlainText(payload.plainText);
  }

  try {
    return renderNode(payload.doc, "root");
  } catch (error) {
    console.error("[blog/tiptap] failed to render document, falling back to plain text.", error);
    return renderPlainText(payload.plainText);
  }
}

/** Plain-text projection used for meta descriptions and JSON-LD. */
export function tiptapPlainText(payload: TiptapPayload | null | undefined): string {
  if (!payload) return "";
  if (typeof payload.plainText === "string") return payload.plainText;

  const collect = (node: TiptapNode | null | undefined): string => {
    if (!node) return "";
    if (typeof node.text === "string") return node.text;
    return (node.content ?? []).map(collect).join(" ");
  };

  return collect(payload.doc).replace(/\s+/g, " ").trim();
}
