/**
 * Test-only: builds the shared `XmlNode` tree with fast-xml-parser, because Node has no
 * DOMParser. It is also the oracle the streaming tokenizer is checked against.
 */
import { XMLParser } from "fast-xml-parser";
import type { XmlNode } from "./xml";

type Ordered = Record<string, unknown> & { ":@"?: Record<string, string> };

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: "", trimValues: false, parseTagValue: false });

function toTree(item: Ordered): XmlNode {
  const name = Object.keys(item).find((key) => key !== ":@")!;
  const body = (item[name] as Ordered[]) ?? [];
  const children = body.filter((child) => !("#text" in child)).map(toTree);
  const text = body
    .filter((child) => "#text" in child)
    .map((child) => String(child["#text"]))
    .join("");
  const attrs = Object.fromEntries(Object.entries(item[":@"] ?? {}).map(([key, value]) => [key.slice(key.indexOf(":") + 1), value]));
  return { name: name.slice(name.indexOf(":") + 1), attrs, children, text };
}

/** The document element of an XML string as an `XmlNode` tree. */
export function xmlTree(xml: string): XmlNode {
  const doc = parser.parse(xml) as Ordered[];
  const root = doc.find((node) => !Object.keys(node).some((key) => key.startsWith("?")))!;
  return toTree(root);
}
