<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Images

Every image committed to this repo must be compressed with `tools/get-low` (a
self-contained binary; safe to re-run — a file is only replaced when the
result is actually smaller). Supports PNG/JPEG/GIF/SVG/WebP/AVIF; `-to webp|avif`
converts, and `tools/get-low video` turns any video or large GIF into a
web-ready WebM+MP4 pair. The `image-optimization` skill has the full workflow.

```bash
tools/get-low -w path/to/image.png
```

## Plans and docs live in the Kodasoft vault

Plans, docs, handovers and reports for this repository live in the Obsidian vault at
`/kodasoft/kodasoft-vault` (private repo `koda-software/kodasoft-vault`), under
`/kodasoft/kodasoft-vault/website/`. Use the `vault-notes` skill (or read `/kodasoft/kodasoft-vault/AGENTS.md`) before creating or
changing a note.

- New plan or doc: copy a template from `/kodasoft/kodasoft-vault/_meta/templates/` into the area
  and fill in the frontmatter (`type`, `status`, `area`, `repos`, `created`, `updated`).
- Lifecycle is the `status` field. Never move a note to mark it done.
- Find notes: `rg -l 'status: (todo|active)' /kodasoft/kodasoft-vault/website`.
- Commit vault changes in the vault repo (`git -C /kodasoft/kodasoft-vault pull --rebase` first),
  never in the same commit as code here.
- Do not create `plans/` or new Markdown docs in this repository. The only Markdown kept here is agent tooling (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.codex/`) and `README.md`; site content stays in `content/`.
