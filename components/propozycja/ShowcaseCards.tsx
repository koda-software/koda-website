import { contract } from "./content";
import { polish } from "./polish";
import { icons, Stages } from "./ui";

/*
 * The product drawn for the system areas that do not have a full scene of
 * their own. Each card is a white window, the way the scene line draws the
 * product, and each plays a short sequence when it arrives (see `showcases`
 * in the engine): `data-step` rows come in one after another and light up in
 * turn, `data-bar` columns grow.
 *
 * The data is the same Demo Firma case the home page follows - contract
 * UM/2026/0014 with Kancelaria Prawna Nowak i Wspólnicy - so a reader moving
 * between pages keeps meeting one case from different sides: its files, the
 * rule that routed it, the invoice its legal opinion produced, the report it
 * shows up in. Everything is demo data and labelled as such.
 */

const data = polish({
  documents: {
    files: [
      { name: "UM-2026-0014 v3.pdf", meta: "aktualna · po opinii prawnej", current: true },
      { name: "UM-2026-0014 v2.pdf", meta: "uwagi działu prawnego" },
      { name: "UM-2026-0014 v1.pdf", meta: "projekt" },
    ],
    template: "Wygenerowano z szablonu „Umowa o świadczenie usług”",
  },
  rules: {
    name: "Akceptacja umów powyżej progu",
    when: ["Wartość netto > 100 000 PLN", "Typ umowy = Umowa o świadczenie usług"],
    then: [
      "Dodaj etap Akceptacja finansowa",
      "Przypisz rolę Dyrektor finansowy",
      "Wyślij powiadomienie z terminem 3 dni",
      "Zablokuj przejście Do podpisu bez akceptacji",
    ],
    test: "Test przed włączeniem zaliczony",
  },
  integrations: {
    fields: [
      { label: "Numer", value: "FZ/2026/0143" },
      { label: "Kontrahent", value: "Kancelaria Prawna Nowak i Wspólnicy" },
      { label: "Kwota brutto", value: "12 300,00 PLN" },
      { label: "Status VAT", value: "czynny podatnik · biała lista" },
    ],
    api: ["POST /api/records", "webhook: status.changed"],
  },
  reports: {
    title: "Wartość obowiązujących umów według typu",
    bars: [
      { label: "Usługi", value: 82, current: true },
      { label: "Licencje", value: 54 },
      { label: "Najem", value: 38 },
      { label: "Serwis", value: 46 },
      { label: "Doradztwo", value: 27 },
    ],
    rows: [
      { ref: "UM/2026/0014", title: "Umowa wdrożeniowa systemu zarządzania jakością", value: "168 000 PLN" },
      { ref: "UM/2026/0011", title: "Usługi księgowe, umowa ramowa", value: "96 000 PLN" },
      { ref: "UM/2026/0006", title: "Obsługa prawna, umowa roczna", value: "84 000 PLN" },
    ],
  },
  apps: [
    { title: "Faktury z KSeF", text: "odbiór, wysyłka i akceptacja", icon: "doc" },
    { title: "Kontrahenci", text: "z weryfikacją VAT", icon: "sheet" },
    { title: "e-Doręczenia", text: "korespondencja urzędowa", icon: "mail" },
    { title: "Obsługa zgłoszeń", text: "przyjęcie, etapy, termin", icon: "bell" },
    { title: "Ewidencja czasu", text: "przy sprawach i projektach", icon: "clock" },
  ],
});

function Bar({ crumb, chip }: { crumb: string; chip: string }) {
  return (
    <div className="window__bar">
      <span className="window__crumb mono">{crumb}</span>
      <span className="chip">{chip}</span>
    </div>
  );
}

export function DocumentsCard() {
  return (
    <div className="window showcase" data-showcase>
      <Bar chip="Demo Firma" crumb={`${contract.module} › ${contract.reference} › Pliki`} />
      <div className="window__body showcase__body">
        <p className="hero__doc-title">{contract.title}</p>
        <Stages current={1} stages={contract.stages.slice(0, 3)} />
        <ul className="files">
          {data.documents.files.map((file) => (
            <li className={`file ${file.current ? "file--current" : ""}`.trim()} data-step key={file.name}>
              <span className="file__icon">{icons.file}</span>
              <span className="file__name mono">{file.name}</span>
              <span className="file__meta">{file.meta}</span>
            </li>
          ))}
        </ul>
        <p className="showcase__note" data-step>
          {icons.doc}
          {data.documents.template}
        </p>
      </div>
    </div>
  );
}

export function RulesCard() {
  return (
    <div className="window showcase" data-showcase>
      <Bar chip="Reguła" crumb="Umowy › Reguły" />
      <div className="window__body showcase__body">
        <p className="hero__doc-title">{data.rules.name}</p>
        <div className="rule">
          <p className="rule__label mono">Gdy</p>
          <ul className="rule__when">
            {data.rules.when.map((condition) => (
              <li className="chip" key={condition}>
                {condition}
              </li>
            ))}
          </ul>
          <p className="rule__label mono">Wykonaj</p>
          <ol className="rule__then">
            {data.rules.then.map((step, index) => (
              <li className="rule__step" data-step key={step}>
                <span className="rule__num mono">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <p className="showcase__note" data-step>
          {icons.check}
          {data.rules.test}
        </p>
      </div>
    </div>
  );
}

export function IntegrationsCard() {
  return (
    <div className="window showcase" data-showcase>
      <Bar chip="KSeF" crumb="Faktury kosztowe › Nowa z KSeF" />
      <div className="window__body showcase__body">
        <p className="source">
          <span className="source__badge mono">KSeF</span>
          Krajowy System e-Faktur · dokument staje się rekordem
        </p>
        <dl className="fields">
          {data.integrations.fields.map((field) => (
            <div className="field" data-step key={field.label}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="api">
          {data.integrations.api.map((endpoint) => (
            <li className="api__item mono" data-step key={endpoint}>
              {endpoint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ReportsCard() {
  return (
    <div className="window showcase" data-showcase>
      <Bar chip="Pulpit zarządu" crumb="Raporty › Umowy" />
      <div className="window__body showcase__body">
        <p className="hero__doc-title">{data.reports.title}</p>
        <div aria-label="Wykres wartości umów według typu, dane demonstracyjne" className="chart" role="img">
          {data.reports.bars.map((bar) => (
            <div className="chart__col" key={bar.label}>
              <span className={`chart__bar ${bar.current ? "chart__bar--current" : ""}`.trim()} data-bar style={{ height: `${bar.value}%` }} />
              <span className="chart__label">{bar.label}</span>
            </div>
          ))}
        </div>
        <p className="showcase__drill mono">Usługi › sprawy, które tworzą tę wartość</p>
        <ul className="drill">
          {data.reports.rows.map((row) => (
            <li className="drill__row" data-step key={row.ref}>
              <span className="mono">{row.ref}</span>
              <span className="drill__title">{row.title}</span>
              <span className="mono drill__value">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AppsCard() {
  return (
    <div className="apps" data-showcase>
      {data.apps.map((app) => (
        <div className="app" data-step key={app.title}>
          <span className="app__icon">{icons[app.icon as keyof typeof icons]}</span>
          <span className="app__title">{app.title}</span>
          <span className="app__text">{app.text}</span>
          <span className="app__chip">Gotowa</span>
        </div>
      ))}
      <div className="app app--custom" data-step>
        <span className="app__icon">{icons.plus}</span>
        <span className="app__title">Wasz moduł</span>
        <span className="app__text">wszystko, co działa u Was inaczej</span>
        <span className="app__chip">Własny</span>
      </div>
    </div>
  );
}

export const showcaseCards = {
  documents: DocumentsCard,
  rules: RulesCard,
  integrations: IntegrationsCard,
  reports: ReportsCard,
  apps: AppsCard,
};
