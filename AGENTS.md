<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Images

Every image committed to this repo must be compressed with `tools/get-low` (a
self-contained binary; safe to re-run — a file is only replaced when the
result is actually smaller). Supports PNG/JPEG/GIF/SVG/WebP/AVIF; `-to webp|avif`
converts. The `image-optimization` skill has the full workflow.

```bash
tools/get-low -w path/to/image.png
```
