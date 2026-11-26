import assert from "node:assert/strict";
import { test } from "node:test";
import { nextJourney, referrerHost } from "./journey";

test("the first page is the landing page and has no previous page", () => {
  assert.deepEqual(nextJourney(undefined, "/pl/blog/e-doreczenia", "www.google.com"), {
    landing: "/pl/blog/e-doreczenia",
    previous: "",
    referrer: "www.google.com",
    current: "/pl/blog/e-doreczenia",
  });
});

test("moving on keeps the landing page and remembers the page just left", () => {
  const first = nextJourney(undefined, "/pl/narzedzia/kwota-slownie", "");
  const second = nextJourney(first, "/pl/blog/e-doreczenia", "");
  const third = nextJourney(second, "/pl/contact", "");

  assert.equal(third.landing, "/pl/narzedzia/kwota-slownie");
  assert.equal(third.previous, "/pl/blog/e-doreczenia");
});

test("recording the same page twice changes nothing", () => {
  const first = nextJourney(undefined, "/pl", "");
  const second = nextJourney(first, "/pl/contact", "");

  assert.equal(nextJourney(second, "/pl/contact", ""), second);
});

test("an outside referrer is reduced to its host", () => {
  assert.equal(referrerHost("https://www.google.com/search?q=obieg+dokumentow", "www.kodasoft.pl"), "www.google.com");
});

test("our own pages and empty or broken referrers give nothing", () => {
  assert.equal(referrerHost("https://www.kodasoft.pl/pl/blog", "www.kodasoft.pl"), "");
  assert.equal(referrerHost("", "www.kodasoft.pl"), "");
  assert.equal(referrerHost("not a url", "www.kodasoft.pl"), "");
});
