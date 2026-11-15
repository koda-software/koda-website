import { parseInvoiceTree, type ParseResult, type XmlNode } from "./ksef";

/** Browser only: parses the XML with the built-in DOMParser, so no XML library ships to the page. */
export function parseInvoiceXml(xml: string): ParseResult {
  const doc = new DOMParser().parseFromString(xml.replace(/^﻿/, ""), "application/xml");
  if (doc.getElementsByTagName("parsererror").length) return { kind: "error", reason: "xml" };
  return parseInvoiceTree(toTree(doc.documentElement));
}

function toTree(element: Element): XmlNode {
  const attrs: Record<string, string> = {};
  for (const attribute of Array.from(element.attributes)) attrs[attribute.localName] = attribute.value;

  const children: XmlNode[] = [];
  let text = "";
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) children.push(toTree(node as Element));
    else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) text += node.nodeValue ?? "";
  }

  return { name: element.localName, attrs, children, text };
}
