import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/site";

/**
 * The link preview card, generated from code rather than kept as a picture in
 * `public/`. The old file still read "OPERO ADAPTIVE ERP" long after the site
 * stopped describing Opero that way; building it here means it follows the
 * brand instead of drifting from it.
 *
 * The path is unchanged, so `siteConfig.defaultOgImage` and every existing
 * share of the old URL keep working.
 */
export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };

/** English, since that is the site's default locale and a card is shared once for both. */
const TAGLINE = "LOW-CODE BPM PLATFORM";

export function GET() {
  const wordmark = readFileSync(join(process.cwd(), "public/branding/kodasoft-logo-white.svg")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // The same gradient the page banners run on.
          backgroundColor: "#000407",
          backgroundImage: "linear-gradient(135deg, #000407 0%, #051730 38%, #0d3a68 68%, #1a68b3 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori renders
            this to a PNG at build time; next/image has no meaning here. */}
        <img alt="" src={`data:image/svg+xml;base64,${wordmark}`} width={620} height={109} />
        <div
          style={{
            width: 260,
            height: 1,
            marginTop: 54,
            backgroundImage: "linear-gradient(90deg, rgba(56,182,255,0), rgba(56,182,255,0.85), rgba(56,182,255,0))",
          }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            letterSpacing: 12,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          {TAGLINE}
        </div>
      </div>
    ),
    SIZE,
  );
}
