import { readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';


type Locale = (typeof supportedLocales)[number];
type OperoListResponse = {
  data?: OperoRecord[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};
type OperoRecord = {
  id: string;
  values?: OperoDocumentationValues;
};
type OperoDocumentationValues = {
  tytul?: string;
  slug?: string;
  sekcja?: string;
  jawnosc?: string;
  status?: string;
  kolejnosc?: number;
  opis_krotki?: string;
  tresc?: RichTextValue | null;
};
type RichTextValue = {
  doc?: TiptapNode;
  plainText?: string;
};
type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: TiptapMark[];
  content?: TiptapNode[];
};
type TiptapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};
type DocumentationPage = {
  id: string;
  title: string;
  slug: string;
  sectionKey: string;
  order: number;
  description: string;
  body: string;
};
type DocumentationSection = {
  key: string;
  title: string;
  pages: DocumentationPage[];
};

const rootDir = process.env.DOCS_OUTPUT_ROOT;
const inputDir = process.env.DOCS_INPUT_DIR;
if (!rootDir || !inputDir) throw new Error('Use docs:generate; explicit staged input/output paths are required.');

const supportedLocales = ['en', 'pl'] as const;
const sectionTitles: Record<Locale, Record<string, string>> = {
  en: {
    '01-wprowadzenie': '01. Introduction',
    '02-podstawy-pracy': '02. Work basics',
    '03-praca-na-danych': '03. Working with data',
    '04-procesy': '04. Processes',
    '05-automatyzacja': '05. Automation',
    '06-budowanie-aplikacji': '06. Building applications',
    '07-raporty-i-analityka': '07. Reports and analytics',
    '08-dokumenty-i-formularze': '08. Documents and forms',
    '09-moduly-gotowe': '09. Ready-made modules',
    '10-integracje': '10. Integrations',
    '11-administracja': '11. Administration',
  },
  pl: {
    '01-wprowadzenie': '01. Wprowadzenie',
    '02-podstawy-pracy': '02. Podstawy pracy',
    '03-praca-na-danych': '03. Praca na danych',
    '04-procesy': '04. Procesy',
    '05-automatyzacja': '05. Automatyzacja',
    '06-budowanie-aplikacji': '06. Budowanie aplikacji',
    '07-raporty-i-analityka': '07. Raporty i analityka',
    '08-dokumenty-i-formularze': '08. Dokumenty i formularze',
    '09-moduly-gotowe': '09. Moduły gotowe',
    '10-integracje': '10. Integracje',
    '11-administracja': '11. Administracja',
  },
};

async function main() {
  for (const locale of supportedLocales) {
    const body = JSON.parse(readFileSync(path.join(inputDir!, `records.${locale}.json`), 'utf8')) as OperoListResponse;
    const pages: DocumentationPage[] = (body.data ?? []).map((record) => {
      const values = record.values!;
      return { id: record.id, title: values.tytul!, slug: slugify(values.slug!), sectionKey: slugify(values.sekcja!),
        order: Number.isFinite(values.kolejnosc) ? Number(values.kolejnosc) : 0,
        description: values.opis_krotki ?? '', body: renderRichText(values.tresc) };
    }).sort(compareDocumentationPages);
    await writeLocaleDocs(locale, pages);
    console.log(`Generated ${pages.length} ${locale.toUpperCase()} Opero docs pages from validated inputs.`);
  }
}

async function writeLocaleDocs(locale: Locale, pages: DocumentationPage[]) {
  const outputDir = path.join(rootDir!, 'content', 'docs', locale, 'opero');
  const sections = groupPagesBySection(locale, pages);

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await writeFile(
    path.join(outputDir, 'meta.json'),
    `${JSON.stringify(
      {
        title: 'Opero',
        pages: ['index', ...sections.map((section) => section.key)],
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(path.join(outputDir, 'index.mdx'), renderOperoIndex(locale, sections));

  for (const section of sections) {
    const sectionDir = path.join(outputDir, section.key);

    await mkdir(sectionDir, { recursive: true });
    await writeFile(
      path.join(sectionDir, 'meta.json'),
      `${JSON.stringify(
        {
          title: section.title,
          pages: section.pages.map((page) => page.slug),
        },
        null,
        2,
      )}\n`,
    );

    for (const page of section.pages) {
      await writeFile(path.join(sectionDir, `${page.slug}.mdx`), renderPage(locale, page));
    }
  }
}

function groupPagesBySection(locale: Locale, pages: DocumentationPage[]) {
  const grouped = new Map<string, DocumentationPage[]>();

  for (const page of pages) {
    const sectionPages = grouped.get(page.sectionKey) ?? [];

    sectionPages.push(page);
    grouped.set(page.sectionKey, sectionPages);
  }

  return [...grouped.entries()]
    .map(([key, sectionPages]) => ({
      key,
      title: sectionTitles[locale][key] ?? titleFromSlug(key),
      pages: sectionPages.sort(compareDocumentationPages),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

function renderOperoIndex(locale: Locale, sections: DocumentationSection[]): string {
  const description =
    locale === 'pl'
      ? 'Dokumentacja produktu Opero generowana z publicznych stron bazy wiedzy.'
      : 'Opero product documentation generated from public knowledge-base pages.';
  const intro =
    locale === 'pl'
      ? 'Wybierz sekcje dokumentacji, aby przejść do stron wygenerowanych z Opero.'
      : 'Choose a documentation section to browse pages generated from Opero.';

  return [
    renderFrontmatter('Opero', description),
    '',
    intro,
    '',
    ...sections.flatMap((section) => [
      `## ${escapeMarkdown(section.title)}`,
      '',
      ...section.pages.map(
        (page) =>
          `- [${escapeMarkdown(page.title)}](/docs/${locale}/opero/${section.key}/${page.slug})`,
      ),
      '',
    ]),
  ].join('\n');
}

function renderPage(locale: Locale, page: DocumentationPage): string {
  return [
    renderFrontmatter(page.title, page.description),
    '',
    page.body.trim() ||
      (locale === 'pl'
        ? 'Ta strona nie ma jeszcze treści.'
        : 'This page does not have content yet.'),
    '',
  ].join('\n');
}

function renderFrontmatter(title: string, description: string): string {
  return ['---', `title: ${yamlString(title)}`, `description: ${yamlString(description)}`, '---'].join(
    '\n',
  );
}

function renderRichText(value?: RichTextValue | null): string {
  if (value?.doc) {
    return renderBlockChildren(value.doc).trim();
  }

  return value?.plainText?.trim() ?? '';
}

function renderBlockChildren(node: TiptapNode): string {
  return (node.content ?? [])
    .map((child) => renderBlock(child))
    .filter((block) => block.trim().length > 0)
    .join('\n\n');
}

function renderBlock(node: TiptapNode): string {
  const children = node.content ?? [];

  switch (node.type) {
    case 'heading': {
      const level = clampNumber(Number(node.attrs?.level ?? 2), 2, 6);

      return `${'#'.repeat(level)} ${renderInlineChildren(node)}`.trim();
    }
    case 'paragraph':
      return renderInlineChildren(node);
    case 'blockquote':
      return renderBlockChildren(node)
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    case 'bulletList':
      return children.map((child) => renderListItem(child, '-')).join('\n');
    case 'orderedList':
      return children.map((child, index) => renderListItem(child, `${index + 1}.`)).join('\n');
    case 'listItem':
      return renderBlockChildren(node);
    case 'codeBlock':
      return renderCodeBlock(node);
    case 'horizontalRule':
      return '---';
    case 'table':
      return renderTable(node);
    default:
      return renderBlockChildren(node) || renderInlineChildren(node);
  }
}

function renderListItem(node: TiptapNode, marker: string): string {
  const blocks = renderBlockChildren(node).split('\n\n');
  const [first = '', ...rest] = blocks;

  return [
    `${marker} ${first.replace(/\n/g, '\n  ')}`.trimEnd(),
    ...rest.map((block) => `  ${block.replace(/\n/g, '\n  ')}`),
  ].join('\n');
}

function renderCodeBlock(node: TiptapNode): string {
  const language = typeof node.attrs?.language === 'string' ? node.attrs.language : '';
  const text = collectPlainText(node);

  return [`\`\`\`${language}`, text, '```'].join('\n');
}

function renderTable(node: TiptapNode): string {
  const rows = (node.content ?? [])
    .filter((child) => child.type === 'tableRow')
    .map((row) =>
      (row.content ?? [])
        .filter((cell) => cell.type === 'tableCell' || cell.type === 'tableHeader')
        .map((cell) =>
          renderBlockChildren(cell)
            .replace(/\n+/g, '<br />')
            .replace(/\|/g, '\\|')
            .trim(),
        ),
    )
    .filter((row) => row.length > 0);

  if (rows.length === 0) {
    return '';
  }

  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalizedRows = rows.map((row) => [
    ...row,
    ...Array.from({ length: columnCount - row.length }, () => ''),
  ]);
  const [header, ...body] = normalizedRows;

  return [
    `| ${header.join(' | ')} |`,
    `| ${Array.from({ length: columnCount }, () => '---').join(' | ')} |`,
    ...body.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');
}

function renderInlineChildren(node: TiptapNode): string {
  return (node.content ?? []).map((child) => renderInline(child)).join('');
}

function renderInline(node: TiptapNode): string {
  if (node.type === 'text') {
    return applyMarks(escapeMarkdown(node.text ?? ''), node.marks ?? []);
  }

  if (node.type === 'hardBreak') {
    return '  \n';
  }

  return renderInlineChildren(node);
}

function applyMarks(text: string, marks: TiptapMark[]): string {
  return marks.reduce((value, mark) => {
    switch (mark.type) {
      case 'bold':
        return wrapMarkdownMark(value, '**');
      case 'italic':
        return wrapMarkdownMark(value, '_');
      case 'strike':
        return wrapMarkdownMark(value, '~~');
      case 'code':
        return wrapMarkdownMark(value.replace(/`/g, '\\`'), '`');
      case 'link': {
        const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : '';

        return href ? `[${value}](${/^\/(?:en|pl)(?:[/?#]|$)/.test(href) ? `/docs${href}` : href})` : value;
      }
      default:
        return value;
    }
  }, text);
}

function wrapMarkdownMark(value: string, marker: string): string {
  const match = value.match(/^(\s*)(.*?)(\s*)$/s);

  if (!match) {
    return `${marker}${value}${marker}`;
  }

  const [, leading, core, trailing] = match;

  return core ? `${leading}${marker}${core}${marker}${trailing}` : value;
}

function collectPlainText(node: TiptapNode): string {
  if (node.text) {
    return node.text;
  }

  return (node.content ?? []).map((child) => collectPlainText(child)).join('');
}

function compareDocumentationPages(a: DocumentationPage, b: DocumentationPage) {
  return (
    a.sectionKey.localeCompare(b.sectionKey) ||
    a.order - b.order ||
    a.title.localeCompare(b.title) ||
    a.id.localeCompare(b.id)
  );
}

function escapeMarkdown(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/</g, '&lt;');
}

function slugify(value: string): string {
  return value
    .replace(/[ąĄ]/g, 'a')
    .replace(/[ćĆ]/g, 'c')
    .replace(/[ęĘ]/g, 'e')
    .replace(/[łŁ]/g, 'l')
    .replace(/[ńŃ]/g, 'n')
    .replace(/[óÓ]/g, 'o')
    .replace(/[śŚ]/g, 's')
    .replace(/[żŻźŹ]/g, 'z')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleFromSlug(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
