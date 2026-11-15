import { strict as assert } from "node:assert";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { xmlTree } from "./test-xml";
import type { XmlNode } from "./xml";
import { XmlSyntaxError, createXmlStream } from "./xml-stream";

/** The whole document as one tree, fed in chunks of `size` characters. */
function streamTree(xml: string, size = xml.length): XmlNode {
  let root: XmlNode | null = null;
  const stream = createXmlStream({ onElement: (node) => (root = node) }, { collect: (path) => path.length === 1 });
  for (let at = 0; at < xml.length; at += size) stream.write(xml.slice(at, at + size));
  stream.end();
  return root!;
}

const fixtures = readdirSync(new URL("./fixtures/", import.meta.url)).filter((file) => file.endsWith(".xml"));

test("builds the same tree as fast-xml-parser for every fixture", () => {
  assert.ok(fixtures.length >= 7);
  for (const file of fixtures) {
    const xml = readFileSync(new URL(`./fixtures/${file}`, import.meta.url), "utf8");
    assert.deepEqual(streamTree(xml), xmlTree(xml), file);
  }
});

test("gives the same tree however the text is chunked", () => {
  const xml = readFileSync(new URL("./fixtures/jpk-v7m3.xml", import.meta.url), "utf8");
  const whole = streamTree(xml);
  for (const size of [1, 2, 7, 64, 4096]) assert.deepEqual(streamTree(xml, size), whole, `chunks of ${size}`);
});

test("decodes entities, character references and CDATA, and skips comments and processing instructions", () => {
  const tree = streamTree(`<?xml version="1.0"?><!-- c --><a x='1 &amp; 2' y="&quot;&#x41;&#66;"><?pi skip?><b>&lt;&gt;&apos;</b><![CDATA[<raw & text>]]><!-- skipped --><c/></a>`);
  assert.deepEqual(tree, {
    name: "a",
    attrs: { x: "1 & 2", y: '"AB' },
    children: [
      { name: "b", attrs: {}, children: [], text: "<>'" },
      { name: "c", attrs: {}, children: [], text: "" },
    ],
    text: "<raw & text>",
  });
});

test("drops namespace prefixes from elements and attributes, and reports the root", () => {
  let root: XmlNode | null = null;
  const stream = createXmlStream({ onElement: (node) => (root = node) }, { collect: (path) => path.length === 1 });
  stream.write(`<tns:JPK xmlns:tns="urn:x" xmlns:etd="urn:e"><etd:NIP etd:kind="a">1</etd:NIP></tns:JPK>`);
  stream.end();
  assert.deepEqual(stream.root(), { name: "JPK", prefix: "tns", attrs: { tns: "urn:x", etd: "urn:e" } });
  assert.deepEqual(root, { name: "JPK", attrs: { tns: "urn:x", etd: "urn:e" }, children: [{ name: "NIP", attrs: { kind: "a" }, children: [], text: "1" }], text: "" });
});

test("hands over only the collected subtrees, with their paths", () => {
  const seen: string[] = [];
  const stream = createXmlStream(
    { onElement: (node, path) => seen.push(`${path.join("/")}=${node.children.map((item) => item.text).join(",")}`) },
    { collect: (path) => path.length === 3 && path[1] === "List" },
  );
  stream.write("<R><Skip><x>1</x></Skip><List><Row><v>a</v></Row><Row><v>b</v><v>c</v></Row></List></R>");
  stream.end();
  assert.deepEqual(seen, ["R/List/Row=a", "R/List/Row=b,c"]);
});

test("throws XmlSyntaxError on broken XML and on a DOCTYPE", () => {
  const parse = (xml: string) => () => streamTree(xml);
  assert.throws(parse("<a><b></a>"), XmlSyntaxError);
  assert.throws(parse("<a><b>"), XmlSyntaxError);
  assert.throws(parse("<a>&nbsp;</a>"), XmlSyntaxError);
  assert.throws(parse("<a></a><b></b>"), XmlSyntaxError);
  assert.throws(parse("text<a></a>"), XmlSyntaxError);
  assert.throws(parse(""), XmlSyntaxError);
  assert.throws(parse('<!DOCTYPE a [<!ENTITY x "y">]><a>&x;</a>'), XmlSyntaxError);
});
