import Link from "next/link";
import GlobeIcon from "lucide-react/dist/esm/icons/globe.mjs";
import type { BlogUiContent } from "@/content/types";
import { blogImageSrc } from "@/lib/blog/images";
import { authorPath } from "@/lib/blog/routes";
import { renderTiptap } from "@/lib/blog/tiptap";
import type { BlogLocale, TiptapPayload } from "@/lib/blog/types";
import { blogMetaClass } from "./primitives";

export type BlogAuthor = {
  slug: string | null;
  nazwa: string;
  stanowisko: string | null;
  avatar: string | null;
  bio: TiptapPayload | null;
  www?: string | null;
  linkedin: string | null;
  x: string | null;
};

const socialLinkBaseClass = "inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] border transition-colors";
const socialLinkLightClass = `${socialLinkBaseClass} border-[rgba(2,2,13,0.12)] text-[var(--color-muted)] hover:border-[rgba(0,103,244,0.24)] hover:text-[var(--color-blue)]`;
const socialLinkDarkClass = `${socialLinkBaseClass} border-white/[0.18] text-white/64 hover:border-white/[0.32] hover:text-white`;

/** lucide v1 dropped brand marks, so the two social glyphs are inlined. */
function LinkedInGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.49 2.49 0 0 1 4.98 3.5ZM3 8.98h4V21H3ZM9.5 8.98h3.83v1.64h.05a4.2 4.2 0 0 1 3.78-2.08C21.1 8.54 22 11 22 14.24V21h-4v-6c0-1.43-.03-3.27-2-3.27s-2.3 1.56-2.3 3.17V21h-4Z" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.53 3h3.05l-6.66 7.61L21.75 21h-6.13l-4.8-6.28L5.3 21H2.24l7.12-8.14L2.25 3h6.29l4.34 5.74L17.53 3Zm-1.07 16.13h1.69L7.62 4.78H5.81l10.65 14.35Z" />
    </svg>
  );
}

/** `invert` switches the borders and ink for the dark author-archive header. */
export function AuthorLinks({ author, invert = false }: { author: BlogAuthor; invert?: boolean }) {
  if (!author.linkedin && !author.x && !author.www) return null;

  const linkClass = invert ? socialLinkDarkClass : socialLinkLightClass;

  return (
    <div className="mt-5 flex gap-2">
      {author.linkedin ? (
        <a className={linkClass} href={author.linkedin} rel="noopener noreferrer nofollow" target="_blank" aria-label={`LinkedIn — ${author.nazwa}`}>
          <LinkedInGlyph />
        </a>
      ) : null}
      {author.x ? (
        <a className={linkClass} href={author.x} rel="noopener noreferrer nofollow" target="_blank" aria-label={`X — ${author.nazwa}`}>
          <XGlyph />
        </a>
      ) : null}
      {author.www ? (
        <a className={linkClass} href={author.www} rel="noopener noreferrer nofollow" target="_blank" aria-label={`${author.nazwa} — www`}>
          <GlobeIcon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

export function AuthorAvatar({ author, size = 40 }: { author: BlogAuthor; size?: number }) {
  const src = blogImageSrc(author.avatar);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS files are served through the authenticated proxy; next/image optimization is off site-wide
    <img
      className="shrink-0 rounded-full border border-[rgba(2,2,13,0.08)] object-cover"
      src={src}
      alt={author.nazwa}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Bordered author block that closes an article. */
export function AuthorBox({ author, locale, ui }: { author: BlogAuthor; locale: BlogLocale; ui: BlogUiContent }) {
  return (
    <section className="mt-14 border-y border-[rgba(2,2,13,0.12)] py-8">
      <p className={blogMetaClass}>{ui.labels.aboutAuthor}</p>
      <div className="mt-5 flex gap-5 max-[560px]:flex-col max-[560px]:gap-4">
        <AuthorAvatar author={author} size={64} />
        <div className="min-w-0">
          <h2 className="m-0 text-[1.25rem] font-medium text-[var(--color-ink)]">
            {author.slug ? (
              <Link className="transition-colors hover:text-[var(--color-blue)]" href={authorPath(locale, author.slug)}>
                {author.nazwa}
              </Link>
            ) : (
              author.nazwa
            )}
          </h2>
          {author.stanowisko ? <p className="m-0 mt-1 text-[0.92rem] text-[var(--color-muted)]">{author.stanowisko}</p> : null}
          {author.bio ? <div className="blog-prose blog-prose-compact mt-4">{renderTiptap(author.bio)}</div> : null}
          <AuthorLinks author={author} />
        </div>
      </div>
    </section>
  );
}
