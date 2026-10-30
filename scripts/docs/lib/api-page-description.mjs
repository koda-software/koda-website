// Generated API pages carry no description: the schema's operations only have a summary,
// which becomes the title. Without one every endpoint page shares the same metadata and a
// sidebar that dwarfs its content, and Google folds them together as duplicates.

const templates = {
  en: (title, method, route) =>
    `${title}. The ${method} ${route} endpoint of the Opero API: parameters, responses and code examples.`,
  pl: (title, method, route) =>
    `${title}. Endpoint ${method} ${route} w Opero API: parametry, odpowiedzi i przykłady kodu.`,
};

/**
 * Adds a `description` to a generated operation page's frontmatter, built from its title and
 * the operation it renders. Pages that already have one, or render no single operation, are
 * returned unchanged.
 */
export function withApiPageDescription(text, locale) {
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!frontmatter || /^description:/m.test(frontmatter[1])) return text;

  const title = /^title: (.+)$/m.exec(frontmatter[1]);
  const operation = /operations=\{\[\{"path":"([^"]+)","method":"([a-z]+)"\}\]\}/.exec(text);
  if (!title || !operation) return text;

  const description = templates[locale](
    unquoteYaml(title[1]),
    operation[2].toUpperCase(),
    operation[1],
  );

  return text.replace(title[0], `${title[0]}\ndescription: ${JSON.stringify(description)}`);
}

function unquoteYaml(value) {
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
  return value;
}
