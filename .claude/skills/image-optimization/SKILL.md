---
name: image-optimization
description: Compress images with the repo-local get-low tool. Use whenever adding or updating any image (PNG, JPEG, GIF, SVG, WebP, AVIF) in the repo, converting images to WebP/AVIF, or when asked to optimize images. Every image committed to this repo must be compressed.
---

# Image optimization with get-low

**Policy: every image committed to this repo must be compressed first.** No
raw screenshots, exports, or downloads go into the tree as-is.

The tool is `tools/get-low` — a self-contained Linux x86-64 binary (no
dependencies; TinyPNG-style pipeline: pngquant + oxipng for PNG, stdlib
re-encode for JPEG, gifsicle for GIF, minification for SVG, quality-80/60 re-encode for WebP/AVIF). If `get-low` is
on PATH, that works too.

## Standard usage

Compress in place before committing (safe to re-run — a file is only
replaced when the result is actually smaller, so it is idempotent):

```bash
tools/get-low -w path/to/image.png
tools/get-low -w assets/          # whole directory, recursive
```

Typical results: 60–90% smaller PNGs/screenshots, 10–30% smaller SVGs.

## When adding images as part of a task

1. Save/copy the image where it belongs.
2. Run `tools/get-low -w <file-or-dir>` on it.
3. Commit the compressed version. Never commit the uncompressed original.

If the tool reports `keep`, the file was already optimal — commit as-is.

## Variants

```bash
tools/get-low -quality 80-95 -w hero.png   # higher fidelity for marketing/hero art
tools/get-low -to webp photo.png           # produce photo.webp (keeps original)
tools/get-low -to avif photo.png           # smallest output, slower encode
tools/get-low -w -gif-lossy 80 anim.gif    # lossy GIF when size matters
tools/get-low help                         # full flag reference
```

Prefer WebP/AVIF for new web-served photos when the surrounding code can
reference the new filename; use plain `-w` when the filename must not change.

## Notes

- JPEG re-encoding strips EXIF metadata (intended for web assets).
- `-to` cannot be combined with `-w` (the extension changes); the original
  file is kept alongside the converted one — delete it yourself if it is no
  longer referenced.
- Exit code 1 means at least one file failed; the failure lines name the
  files, the rest were still processed.
- Source lives in `~/Projects/personal/get-low` (Dockerized build, `make release`).
