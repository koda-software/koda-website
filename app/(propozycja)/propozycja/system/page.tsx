import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCall, PageHero, TwoTone } from "@/components/propozycja/blocks";
import { routes } from "@/components/propozycja/content-nav";
import { systemAreas } from "@/components/propozycja/content-system";
import { Scene } from "@/components/propozycja/Scene";
import { Screen } from "@/components/propozycja/Screen";
import { Foundation } from "@/components/propozycja/scenes/Foundation";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";
import { icons } from "@/components/propozycja/ui";

export const metadata: Metadata = {
  title: "Platforma Opero · KodaSoft",
  description: "Jedna architektura, na której powstają aplikacje dla każdego obszaru organizacji.",
};

/**
 * The system as a whole: every area one click away, then the architecture
 * they share. The grid comes first on purpose - someone who opened "System"
 * from the menu is usually looking for one thing, and should find it before
 * being told how the whole is built.
 */
export default function SystemOverview() {
  return (
    <ProposalPage>
      <PageHero
        lead="Gotowe aplikacje tam, gdzie błąd kosztuje najwięcej, i własne moduły na wszystko, co działa u Was inaczej. Jedne uprawnienia, jedna historia każdej sprawy, jedna architektura pod spodem."
        screen={{
          name: "karta-pisma",
          caption: "Przestrzeń pracy Demo Firma: z lewej moduły, Kontrahenci i finanse, Zakupy, Umowy, Kancelaria, Analityka, a na ekranie pismo w obiegu kancelarii.",
        }}
        title={["Jeden system", "dla każdego obszaru."]}
      />

      <Scene className="section" cut="card" id="obszary" prev="dark" tone="light">
        <div className="section__head">
          <TwoTone lines={["Wybierz, od czego", "chcecie zacząć."]} />
        </div>
        <ul className="area-index">
          {systemAreas.map((area) => (
            <li key={area.slug}>
              <Link className="area-row" href={routes.area(area.slug)}>
                <span className="area-row__title">{area.nav}</span>
                <span className="area-row__text">{area.blurb}</span>
                <span aria-hidden="true" className="area-row__arrow">
                  {icons.arrowRight}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Screen
          caption="Analityka kancelarii w Demo Firma: pisma po terminie, sprawy w toku i rozkład pism na jednostki, z tych samych danych, na których działa obieg."
          className="screen--wide"
          name="analityka-kancelarii"
          sizes="(min-width: 1360px) 1360px, 100vw"
        />
      </Scene>

      <Foundation cut="wipe" dive={false} id="architektura" prev="light" />

      <ClosingCall prev="dark" />
    </ProposalPage>
  );
}
