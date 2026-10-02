/**
 * Preserve heading hits: the bundled Algolia adapter currently returns only page hits.
 * @param {Array<{objectID: string, title: string, url: string, section?: string, section_id?: string, breadcrumbs?: string[]}>} hits
 * @param {string} locale
 * @returns {import('fumadocs-core/search').SortedResult[]}
 */
export function sectionSearchResults(hits, locale) {
  /** @type {import('fumadocs-core/search').SortedResult[]} */
  const results = [];
  const pages = new Set(), sections = new Set();
  for (const hit of hits) {
    if (typeof hit.url !== 'string' || !(hit.url === `/docs/${locale}` || hit.url.startsWith(`/docs/${locale}/`))) continue;
    if (!pages.has(hit.url)) {
      pages.add(hit.url);
      results.push({ id: hit.url, type: 'page', url: hit.url, content: hit.title, breadcrumbs: hit.breadcrumbs });
    }
    // These synthetic API search labels are not DOM headings. Body headings use
    // the IDs supplied by the OpenAPI renderer; endpoint/parameters open the page.
    let anchor = hit.section_id;
    if (anchor === 'api-endpoint' || anchor === 'api-parameters') anchor = undefined;
    if (anchor === 'api-request-body') anchor = 'request-body';
    if (anchor === 'api-response-body') anchor = 'response-body';
    if (!anchor || !hit.section) continue;
    const url = `${hit.url}#${anchor}`;
    if (sections.has(url)) continue;
    sections.add(url);
    results.push({ id: url, type: 'heading', url, content: hit.section });
  }
  return results;
}
