// Generated API pages carry no description: the schema's operations only have a summary,
// which becomes the title. Without one every endpoint page shares the same metadata and a
// sidebar that dwarfs its content, and Google folds them together as duplicates.

/** Search results cut descriptions at roughly 155–160 characters. */
const maxLength = 155;

// Most specific first. The route is the most useful detail, but long routes push the
// description past what a search result shows, so those pages name only the method. Short
// titles would leave the plain version under ~110 characters, so the longest
// versions come first and the first one that fits wins.
const templates = {
  en: [
    (title, method, route) =>
      `${title}. The ${method} ${route} endpoint of the Opero API: authentication, request parameters, response schemas and code examples.`,
    (title, method, route) =>
      `${title}. The ${method} ${route} endpoint of the Opero API: authentication, parameters, responses and code examples.`,
    (title, method, route) =>
      `${title}. The ${method} ${route} endpoint of the Opero API: parameters, responses and code examples.`,
    (title, method) =>
      `${title}. Reference for the Opero API ${method} endpoint: authentication, request parameters, response schemas and code examples.`,
    (title, method) =>
      `${title}. Reference for the Opero API ${method} endpoint: parameters, responses and code examples.`,
  ],
  pl: [
    (title, method, route) =>
      `${title}. Endpoint ${method} ${route} w Opero API: uwierzytelnianie, parametry żądania, schematy odpowiedzi i przykłady kodu.`,
    (title, method, route) =>
      `${title}. Endpoint ${method} ${route} w Opero API: uwierzytelnianie, parametry, odpowiedzi i przykłady kodu.`,
    (title, method, route) =>
      `${title}. Endpoint ${method} ${route} w Opero API: parametry, odpowiedzi i przykłady kodu.`,
    (title, method) =>
      `${title}. Dokumentacja endpointu ${method} w Opero API: uwierzytelnianie, parametry żądania, schematy odpowiedzi i przykłady kodu.`,
    (title, method) =>
      `${title}. Dokumentacja endpointu ${method} w Opero API: parametry, odpowiedzi i przykłady kodu.`,
  ],
};

/**
 * Sets a generated operation page's frontmatter `description`, built from its title and the
 * operation it renders. A description this function wrote earlier is rebuilt, so template
 * changes reach committed pages; a hand-written one, or a page rendering no single operation,
 * is returned unchanged.
 */
export function withApiPageDescription(text, locale) {
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!frontmatter) return text;

  const title = /^title: (.+)$/m.exec(frontmatter[1]);
  const operation = /operations=\{\[\{"path":"([^"]+)","method":"([a-z]+)"\}\]\}/.exec(text);
  if (!title || !operation) return text;

  const args = [unquoteYaml(title[1]), operation[2].toUpperCase(), operation[1]];
  const candidates = templates[locale].map((template) => template(...args));
  const description = candidates.find((candidate) => candidate.length <= maxLength) ?? candidates.at(-1);
  const line = `description: ${JSON.stringify(description)}`;

  const existing = /^description: (.+)$/m.exec(frontmatter[1]);
  if (!existing) return text.replace(title[0], `${title[0]}\n${line}`);
  if (!candidates.includes(unquoteYaml(existing[1]))) return text;

  return text.replace(existing[0], line);
}

function unquoteYaml(value) {
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
  return value;
}
