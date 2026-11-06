import Link from "next/link";
import { contactDetails, footerColumns, routes } from "../content-nav";
import { icons, KodaSoftMark } from "../ui";

/**
 * A footer that does a footer's job.
 *
 * The first proposal ended on the mark at full width and an email address:
 * a good last frame for a film, too little for a site, where the footer is
 * the place people go to find something - a page they saw earlier, a phone
 * number, the privacy policy. So it is a classic one: the mark and the
 * closing sentence with the one action, then the site map in columns, then
 * the legal line. The brand moment stays, at a size that leaves room for the
 * rest.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-foot on-dark">
      <div className="site-foot__inner">
        <div className="site-foot__top">
          <div className="site-foot__brand">
            <KodaSoftMark className="site-foot__mark" on="dark" />
            <p className="site-foot__claim">
              Tworzymy Opero, platformę, która obejmie wszystkie obszary organizacji.
            </p>
          </div>
          <Link className="btn btn--mist" href={routes.contact}>
            Umów demo {icons.arrowRight}
          </Link>
        </div>

        <div className="site-foot__grid">
          {footerColumns.map((column) => (
            <nav aria-label={column.title} className="site-foot__col" key={column.title}>
              <p className="site-foot__title">{column.title}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="site-foot__col">
            <p className="site-foot__title">Kontakt</p>
            <ul>
              <li>
                <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
              </li>
              <li>
                <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>{contactDetails.phone}</a>
              </li>
              <li>
                <a href={contactDetails.linkedin} rel="noopener noreferrer" target="_blank">
                  Opero na LinkedIn
                </a>
              </li>
            </ul>
            <p className="site-foot__note">
              Rozmawiacie z twórcami systemu. Na pytanie techniczne odpowiedź pada w tej samej rozmowie.
            </p>
          </div>
        </div>

        <div className="site-foot__legal">
          <span>© {year} KodaSoft</span>
          <span className="site-foot__legal-links">
            <Link href={routes.privacy}>Polityka prywatności</Link>
            <a href={`https://www.${contactDetails.site}`}>{contactDetails.site}</a>
            <span>Język: polski</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
