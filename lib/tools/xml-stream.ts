import type { XmlNode } from "./xml";

/**
 * An incremental XML tokenizer with no DOM and no dependencies, for files too large to
 * hold as one DOM (the JPK viewer reads files up to 100 MB in a Web Worker, where
 * `DOMParser` does not exist).
 *
 * Feed it text in chunks of any size: chunks may split a tag, an entity or a surrogate
 * pair anywhere. It builds `XmlNode` subtrees only for the elements `collect` asks for,
 * hands each one to `onElement` when it closes, and then forgets it, so memory stays at
 * one subtree no matter how long the file is.
 *
 * It handles the XML declaration and processing instructions (skipped), comments,
 * CDATA, the five predefined entities and numeric character references, attributes in
 * either quote, self-closing tags and namespace prefixes (dropped, as in `ksef-dom.ts`).
 * A `<!DOCTYPE` throws: JPK files never carry one, and refusing DTDs rules out
 * entity-expansion attacks.
 */

export class XmlSyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XmlSyntaxError";
  }
}

export type XmlStreamHandlers = {
  /** Called with each completed collected element; the subtree is discarded afterwards. `path` holds local names from the root to this element. */
  onElement(node: XmlNode, path: readonly string[]): void;
};

export type XmlStreamOptions = {
  /**
   * Called once for each start tag that is not already inside a collected element, with
   * the local names from the root to it (the root alone is `["JPK"]`). Returning true
   * builds that element's subtree and passes it to `onElement` when it closes.
   */
  collect(path: readonly string[]): boolean;
};

export type XmlStream = {
  write(chunk: string): void;
  /** Throws `XmlSyntaxError` on unclosed tags, trailing text or an empty document. */
  end(): void;
  /** Local name, prefix and attributes of the root, once seen. */
  root(): { name: string; prefix: string | null; attrs: Record<string, string> } | null;
};

const local = (name: string) => name.slice(name.indexOf(":") + 1);

const ENTITIES: Record<string, string> = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };

function decode(raw: string): string {
  let amp = raw.indexOf("&");
  if (amp === -1) return raw;

  let out = "";
  let from = 0;
  while (amp !== -1) {
    const semi = raw.indexOf(";", amp);
    if (semi === -1) throw new XmlSyntaxError("Unterminated entity");
    const name = raw.slice(amp + 1, semi);
    out += raw.slice(from, amp) + entity(name);
    from = semi + 1;
    amp = raw.indexOf("&", from);
  }
  return out + raw.slice(from);
}

function entity(name: string): string {
  const named = ENTITIES[name];
  if (named !== undefined) return named;

  const code = /^#x[0-9a-fA-F]{1,6}$/.test(name) ? parseInt(name.slice(2), 16) : /^#\d{1,7}$/.test(name) ? parseInt(name.slice(1), 10) : NaN;
  if (Number.isNaN(code) || code > 0x10ffff || code === 0) throw new XmlSyntaxError(`Unknown entity &${name};`);
  return String.fromCodePoint(code);
}

const ATTRIBUTE = /\s*([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/y;

function parseAttributes(raw: string, from: number): Record<string, string> {
  const attrs: Record<string, string> = {};
  let at = from;
  while (at < raw.length) {
    ATTRIBUTE.lastIndex = at;
    const match = ATTRIBUTE.exec(raw);
    if (!match) {
      if (raw.slice(at).trim()) throw new XmlSyntaxError("Malformed attribute");
      break;
    }
    attrs[local(match[1])] = decode(match[2] ?? match[3] ?? "");
    at = ATTRIBUTE.lastIndex;
  }
  return attrs;
}

const isWhitespace = (value: string) => !/\S/.test(value);

export function createXmlStream(handlers: XmlStreamHandlers, options: XmlStreamOptions): XmlStream {
  let buffer = "";
  let pos = 0;
  /** Raw (prefixed) names of the open elements, to match end tags. */
  const names: string[] = [];
  /** Local names of the open elements. */
  const path: string[] = [];
  /** The node being built at each open level, or null outside a collected subtree. */
  const nodes: Array<XmlNode | null> = [];
  /** Index in `names` of the collected element being built, or -1. */
  let collecting = -1;
  let rootInfo: ReturnType<XmlStream["root"]> = null;
  let rootClosed = false;

  const text = (from: number, to: number) => {
    if (collecting !== -1) {
      const node = nodes[nodes.length - 1]!;
      node.text += decode(buffer.slice(from, to));
    } else if (!names.length && !isWhitespace(buffer.slice(from, to))) {
      throw new XmlSyntaxError("Text outside the root element");
    }
  };

  const open = (raw: string) => {
    const selfClosing = raw.endsWith("/");
    const body = selfClosing ? raw.slice(0, -1) : raw;
    const nameEnd = body.search(/[\s]/);
    const name = nameEnd === -1 ? body : body.slice(0, nameEnd);
    if (!name || /[<>"'=&]/.test(name)) throw new XmlSyntaxError("Malformed start tag");
    if (rootClosed) throw new XmlSyntaxError("Content after the root element");

    const localName = local(name);
    const depth = names.length;
    let node: XmlNode | null = null;

    if (collecting !== -1) {
      node = { name: localName, attrs: nameEnd === -1 ? {} : parseAttributes(body, nameEnd), children: [], text: "" };
      nodes[depth - 1]!.children.push(node);
    } else {
      path.push(localName);
      const attrs = nameEnd === -1 ? {} : parseAttributes(body, nameEnd);
      if (depth === 0) rootInfo = { name: localName, prefix: name.includes(":") ? name.slice(0, name.indexOf(":")) : null, attrs };
      if (options.collect(path)) {
        node = { name: localName, attrs, children: [], text: "" };
        collecting = depth;
      }
      path.pop();
    }

    names.push(name);
    path.push(localName);
    nodes.push(node);
    if (selfClosing) close(name);
  };

  const close = (name: string) => {
    const depth = names.length - 1;
    if (depth < 0 || names[depth] !== name) throw new XmlSyntaxError(`Unexpected end tag </${name}>`);

    if (collecting === depth) {
      const node = nodes[depth]!;
      collecting = -1;
      handlers.onElement(node, path.slice());
    }

    names.pop();
    path.pop();
    nodes.pop();
    if (!names.length) rootClosed = true;
  };

  /** End of a start tag: the first ">" outside a quoted attribute value. */
  const tagEnd = (from: number) => {
    const gt = buffer.indexOf(">", from);
    if (gt === -1) return -1;

    let quoted = false;
    for (let at = from; at < gt; at += 1) {
      const code = buffer.charCodeAt(at);
      if (code === 34 || code === 39) {
        quoted = true;
        break;
      }
    }
    if (!quoted) return gt;

    let quote = 0;
    for (let at = from; at < buffer.length; at += 1) {
      const code = buffer.charCodeAt(at);
      if (quote) {
        if (code === quote) quote = 0;
      } else if (code === 34 || code === 39) {
        quote = code;
      } else if (code === 62) {
        return at;
      }
    }
    return -1;
  };

  const process = () => {
    for (;;) {
      const lt = buffer.indexOf("<", pos);
      if (lt === -1) {
        /* Text with no tag after it yet. Inside a collected element it waits for the rest. */
        if (collecting === -1 && pos < buffer.length) {
          text(pos, buffer.length);
          pos = buffer.length;
        }
        return;
      }
      if (lt > pos) {
        text(pos, lt);
        pos = lt;
      }
      if (pos + 1 >= buffer.length) return;

      const next = buffer.charCodeAt(pos + 1);
      if (next === 47) {
        const end = buffer.indexOf(">", pos + 2);
        if (end === -1) return;
        close(buffer.slice(pos + 2, end).trim());
        pos = end + 1;
      } else if (next === 63) {
        const end = buffer.indexOf("?>", pos + 2);
        if (end === -1) return;
        pos = end + 2;
      } else if (next === 33) {
        const rest = buffer.slice(pos, pos + 9);
        if (rest.startsWith("<!--")) {
          const end = buffer.indexOf("-->", pos + 4);
          if (end === -1) return;
          pos = end + 3;
        } else if (rest.startsWith("<![CDATA[")) {
          const end = buffer.indexOf("]]>", pos + 9);
          if (end === -1) return;
          if (collecting !== -1) nodes[nodes.length - 1]!.text += buffer.slice(pos + 9, end);
          else if (!names.length) throw new XmlSyntaxError("CDATA outside the root element");
          pos = end + 3;
        } else if (rest.length < 9 && ("<!--".startsWith(rest) || "<![CDATA[".startsWith(rest))) {
          return;
        } else {
          throw new XmlSyntaxError(rest.startsWith("<!DOCTYPE") ? "DTDs are not supported" : "Unsupported markup");
        }
      } else {
        const end = tagEnd(pos + 1);
        if (end === -1) return;
        open(buffer.slice(pos + 1, end));
        pos = end + 1;
      }
    }
  };

  return {
    write(chunk) {
      buffer = pos ? buffer.slice(pos) + chunk : buffer + chunk;
      pos = 0;
      process();
    },
    end() {
      process();
      const rest = buffer.slice(pos);
      if (names.length) throw new XmlSyntaxError(`Unclosed element <${names[names.length - 1]}>`);
      if (!isWhitespace(rest)) throw new XmlSyntaxError("Unexpected end of document");
      if (!rootInfo) throw new XmlSyntaxError("Empty document");
    },
    root: () => rootInfo,
  };
}
