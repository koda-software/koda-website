import { strict as assert } from "node:assert";
import { test } from "node:test";
import { faqAnswerHtml, parseFaqAnswer, safeHref } from "./faq";

const html = (source: string) => faqAnswerHtml(parseFaqAnswer(source));

test("plain text is one paragraph", () => {
  assert.deepEqual(parseFaqAnswer("  Tak, gdy dokumenty akceptuje więcej niż jedna osoba.  "), [
    [{ type: "text", text: "Tak, gdy dokumenty akceptuje więcej niż jedna osoba." }],
  ]);
});

test("a blank line or <p> starts a new paragraph; a single newline is a space", () => {
  assert.equal(parseFaqAnswer("One\ntwo.\n\nThree.").length, 2);
  assert.equal(html("One\ntwo.\n\nThree."), "<p>One two.</p><p>Three.</p>");
  assert.equal(html("<p>One.</p><p>Two.</p>"), "<p>One.</p><p>Two.</p>");
});

test("links, emphasis and line breaks are kept", () => {
  assert.equal(
    html('Zobacz <a href="https://www.kodasoft.pl/pl/opero">Opero</a> i <b>KSeF</b>,<br>a potem <i>pilnuj</i> terminów.'),
    'Zobacz <a href="https://www.kodasoft.pl/pl/opero">Opero</a> i <strong>KSeF</strong>,<br>a potem <em>pilnuj</em> terminów.',
  );
  assert.equal(html("<a href='/pl/blog/ksef'>tutaj</a>"), '<a href="/pl/blog/ksef">tutaj</a>');
});

test("other tags are dropped but their text stays; script and style lose their content", () => {
  assert.equal(html('<span class="x">Tekst</span> <img src="x.png"> dalej'), "Tekst dalej");
  assert.equal(html("Przed<script>alert(1)</script> po<style>p{}</style>."), "Przed po.");
  assert.equal(html('<div onclick="x()">Klik</div>'), "Klik");
});

test("unsafe links keep their text without the link", () => {
  assert.equal(html('<a href="javascript:alert(1)">kliknij</a> teraz'), "kliknij teraz");
  assert.equal(html('<a href="//evil.example">tu</a>'), "tu");
  assert.equal(html("<a>bez adresu</a>"), "bez adresu");
  assert.equal(safeHref("mailto:biuro@example.com"), "mailto:biuro@example.com");
  assert.equal(safeHref(" JaVaScRiPt:alert(1)"), null);
  assert.equal(safeHref("data:text/html,x"), null);
});

test("entities decode once and text is escaped again for JSON-LD", () => {
  assert.deepEqual(parseFaqAnswer("A &amp; B &lt;3 &#8211; &quot;C&quot;"), [[{ type: "text", text: 'A & B <3 – "C"' }]]);
  assert.equal(html("1 < 2 &amp; <b>x</b>"), "1 &lt; 2 &amp; <strong>x</strong>");
  assert.equal(html('<a href="/a?x=1&amp;y=2">q</a>'), '<a href="/a?x=1&amp;y=2">q</a>');
});

test("mismatched and unclosed tags do not lose text", () => {
  assert.equal(html("<b>bold <i>both</b> after"), "<strong>bold <em>both</em></strong> after");
  assert.equal(html("stray </b> close"), "stray close");
  assert.equal(html("<b>open\n\nnext"), "<p><strong>open</strong></p><p>next</p>");
});

test("empty answers produce no paragraphs", () => {
  assert.deepEqual(parseFaqAnswer(""), []);
  assert.deepEqual(parseFaqAnswer("<p></p>\n\n  "), []);
});
