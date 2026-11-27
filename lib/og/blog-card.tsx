import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const blogCardSize = { width: 1200, height: 630 };

const ink = "#0b1116";
const brandBlue = "#38b6ff";

/**
 * Read once per server instance. Satori takes only static TTF/OTF/WOFF, so the
 * brand font is kept here as a plain TTF rather than the variable WOFF2
 * next/font serves to pages.
 */
const assets = Promise.all([
  readFile(join(process.cwd(), "lib/og/fonts/Sora-SemiBold.ttf")),
  readFile(join(process.cwd(), "public/branding/opero-kodasoft-logo-white.svg")),
]).then(([sora, logo]) => ({ sora, logo: `data:image/svg+xml;base64,${logo.toString("base64")}` }));

/** Long titles step down so three or four lines still fit above the fold of a feed card. */
function titleSize(title: string) {
  if (title.length <= 40) return 64;
  if (title.length <= 65) return 56;
  if (title.length <= 95) return 50;
  return 44;
}

/**
 * Satori reads only PNG, JPEG and GIF bitmaps, and blog covers are WebP, so the
 * cover is cropped to the card and re-encoded before it goes in.
 */
async function coverDataUri(cover: Buffer) {
  const jpeg = await sharp(cover)
    .resize(blogCardSize.width, blogCardSize.height, { fit: "cover" })
    .jpeg({ quality: 88 })
    .toBuffer();

  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

/**
 * The branded link preview for a blog article: the cover under a dark wash,
 * the Opero logo signed "by kodasoft_", the category and the title in Sora. Without a cover it
 * falls back to the gradient of the site-wide card (app/og-image.png).
 *
 * Returns a JPEG: Satori writes PNG, which for a photo is around a megabyte,
 * while a JPEG of the same card is a tenth of that and loads faster in feeds.
 */
export async function renderBlogCard({
  title,
  label,
  cover,
}: {
  title: string;
  label: string | null;
  cover: Buffer | null;
}): Promise<Buffer> {
  const [{ sora, logo }, background] = await Promise.all([assets, cover ? coverDataUri(cover) : null]);

  const png = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: ink,
          backgroundImage: background
            ? // Two washes over the photo: a floor under the text and a lighter one from the left, so any cover stays legible.
              [
                "linear-gradient(0deg, rgba(11,17,22,0.92) 0%, rgba(11,17,22,0.66) 34%, rgba(11,17,22,0.12) 72%, rgba(11,17,22,0.4) 100%)",
                "linear-gradient(90deg, rgba(11,17,22,0.5) 0%, rgba(11,17,22,0) 65%)",
                `url(${background})`,
              ].join(", ")
            : "linear-gradient(135deg, #0b1116 0%, #0f2437 38%, #12456f 68%, #1c6cb5 100%)",
          backgroundSize: "100% 100%",
          fontFamily: "Sora",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            // Feeds crop the 1.91:1 card: LinkedIn's desktop feed shows about 1.6:1 and trims ~90px
            // off each side, X shows 2:1 and trims ~15px off top and bottom. 140px at the sides keeps
            // the logo and text whole down to about 1.5:1.
            padding: "60px 140px 64px",
          }}
        >
          {/* The "opero / by kodasoft_" lockup; its viewBox is 186.3 x 60.17. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws this into a bitmap; next/image has no meaning here. */}
          <img alt="" src={logo} width={285} height={92} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {label ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: brandBlue,
                  marginBottom: 22,
                }}
              >
                {label}
              </div>
            ) : null}
            <div
              style={{
                display: "block",
                lineClamp: 4,
                maxWidth: 920,
                fontSize: titleSize(title),
                lineHeight: 1.16,
                letterSpacing: -0.5,
                color: "#ffffff",
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...blogCardSize,
      fonts: [{ name: "Sora", data: sora, weight: 600, style: "normal" }],
    },
  );

  return sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
