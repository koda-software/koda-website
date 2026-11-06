import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next, Sora } from "next/font/google";
import Script from "next/script";
import "./propozycja.css";

/*
 * A root layout of its own, in its own route group.
 *
 * The proposal is a clean-slate rebrand and must not inherit anything from the
 * current site: not its stylesheet, not Tailwind's reset, not the header, the
 * smooth-scroll provider or the analytics banner. Next allows several root
 * layouts side by side when each lives in a route group, and navigating
 * between them is a full page load - which is exactly the isolation wanted
 * here. The `(pl)` and `(en)` sites are untouched by anything in this folder.
 */

/* Sora carries the message, Atkinson Hyperlegible Next carries the product -
   the same split the brand book makes between marketing and interface type.
   The mono cut of the same family sets reference numbers and the event log,
   where fixed-width figures are what make a column of times readable. */
const display = Sora({ subsets: ["latin", "latin-ext"], variable: "--f-display", display: "swap" });
const ui = Atkinson_Hyperlegible_Next({ subsets: ["latin", "latin-ext"], variable: "--f-ui", display: "swap" });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin", "latin-ext"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  title: "KodaSoft · Opero: zamień sposób działania organizacji w oprogramowanie",
  description:
    "Fundament dla aplikacji całej organizacji. Bezpieczna architektura, pełna kontrola i swoboda budowy bez ograniczeń.",
  /* A working proposal, not a published page. */
  robots: { index: false, follow: false },
  icons: { icon: "/propozycja/branding/favicon.svg" },
};

export default function ProposalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${display.variable} ${ui.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {/* Marks the document as scripted before first paint, so the hero can
            start in its pre-intro state instead of flashing in full and then
            jumping back to animate. See the `html.js` rules in the stylesheet,
            which also carry a fallback in case the engine never arrives. */}
        <Script id="op-js" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        {children}
      </body>
    </html>
  );
}
