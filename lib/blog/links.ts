/** Links in CMS text that leave kodasoft.pl; they open in a new tab with `noopener noreferrer`. */
export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?kodasoft\.pl/i.test(href);
}
