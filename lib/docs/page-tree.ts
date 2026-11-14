import type * as PageTree from 'fumadocs-core/page-tree';

type FooterItem = Pick<PageTree.Item, 'name' | 'description' | 'url'>;

/**
 * The sidebar tree without page descriptions.
 *
 * The docs layout serialises the whole tree into every docs page about four times (HTML, .rsc
 * and the prefetch segments). The sidebar never shows page descriptions, which were 40% of that
 * payload; the only reader was the previous/next footer, which gets them from
 * `getFooterItems` instead. Folder descriptions stay: the sidebar tab switcher shows them.
 */
export function withoutPageDescriptions(tree: PageTree.Root): PageTree.Root {
  return { ...tree, children: tree.children.map(stripNode) };
}

function stripNode(node: PageTree.Node): PageTree.Node {
  if (node.type === 'page') return stripPage(node);
  if (node.type === 'folder') {
    return {
      ...node,
      index: node.index && stripPage(node.index),
      children: node.children.map(stripNode),
    };
  }
  return node;
}

function stripPage(page: PageTree.Item): PageTree.Item {
  const rest = { ...page };
  delete rest.description;
  return rest;
}

/**
 * The previous and next pages for the docs footer, worked out the way fumadocs' own footer does
 * on the client: pages in order within the innermost sidebar tab (root folder) that holds the
 * page, skipping external links.
 */
export function getFooterItems(
  tree: PageTree.Root,
  url: string,
): { previous?: FooterItem; next?: FooterItem } {
  const path = findPath(tree.children, url);
  if (!path) return {};

  const root =
    path.findLast(
      (node): node is PageTree.Folder => node.type === 'folder' && Boolean(node.root),
    ) ?? tree;
  const list: PageTree.Item[] = [];
  const collect = (node: PageTree.Node) => {
    if (node.type === 'folder') {
      if (node.index) collect(node.index);
      node.children.forEach(collect);
    } else if (node.type === 'page' && !node.external) {
      list.push(node);
    }
  };
  root.children.forEach(collect);

  const index = list.findIndex((item) => item.url === url);
  if (index === -1) return {};
  return { previous: toFooterItem(list[index - 1]), next: toFooterItem(list[index + 1]) };
}

function findPath(nodes: PageTree.Node[], url: string): PageTree.Node[] | undefined {
  for (const node of nodes) {
    if (node.type === 'page' && node.url === url) return [node];
    if (node.type === 'folder') {
      if (node.index?.url === url) return [node, node.index];
      const rest = findPath(node.children, url);
      if (rest) return [node, ...rest];
    }
  }
  return undefined;
}

function toFooterItem(item: PageTree.Item | undefined): FooterItem | undefined {
  return item && { name: item.name, description: item.description, url: item.url };
}
