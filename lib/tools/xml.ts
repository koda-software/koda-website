/**
 * The minimal XML tree the tools read: elements by local name, attributes by local
 * name, and the element's own text. It comes from `DOMParser` in the KSeF viewer
 * (`ksef-dom.ts`), from the streaming tokenizer in the JPK viewer (`xml-stream.ts`)
 * and from fast-xml-parser in the tests, so the readers run anywhere.
 */
export type XmlNode = { name: string; attrs: Record<string, string>; children: XmlNode[]; text: string };

/** Drops a namespace prefix: "etd:NIP" → "NIP". */
export const local = (name: string) => name.slice(name.indexOf(":") + 1);

export const child = (node: XmlNode | null | undefined, name: string) => node?.children.find((item) => local(item.name) === name) ?? null;

export const children = (node: XmlNode | null | undefined, name: string) => node?.children.filter((item) => local(item.name) === name) ?? [];

/** The trimmed text of the first child with this name, or null when it is missing or empty. */
export const text = (node: XmlNode | null | undefined, name: string) => {
  const value = child(node, name)?.text.trim();
  return value ? value : null;
};

/** The body of the official TNumerKSeF pattern (JPK_V7(3) XSD), without anchors. */
const KSEF_NUMBER_BODY =
  "([1-9]((\\d[1-9])|([1-9]\\d))\\d{7}|M\\d{9}|[A-Z]{3}\\d{7})-(20[2-9]\\d|2[1-9]\\d{2}|[3-9]\\d{3})(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])-[0-9A-F]{6}-?[0-9A-F]{6}-[0-9A-F]{2}";

/** Official TNumerKSeF pattern from the JPK_V7(3) XSD: NIP, "M" + 9 digits or 3 letters + 7 digits, the date, then hex groups. */
export const KSEF_NUMBER = new RegExp(`^${KSEF_NUMBER_BODY}$`);

/**
 * The same pattern, case-insensitive, for finding a number inside a file name; group 1 is
 * the number. No lookbehind, so it also compiles in older Safari.
 */
export const KSEF_NUMBER_IN_TEXT = new RegExp(`(?:^|[^0-9A-Za-z])(${KSEF_NUMBER_BODY})(?![0-9A-Za-z])`, "i");
