"use client";

import type { JpkViewerLabels } from "@/content/types";
import { DECLARATION_FIELDS, DECLARATION_FROM_REGISTER, DECLARATION_GROUPS, registerValue, type JpkAnalysis } from "@/lib/tools/jpk";
import { Block } from "./JpkSummary";
import { numClass, tdClass, thClass, warnText, zloty, type Locale } from "./format";

const ORDER: readonly string[] = DECLARATION_FIELDS;
const REGISTER_FIELD = new Map(DECLARATION_FROM_REGISTER.map(([p, k]) => [p, k]));

type Group = keyof typeof DECLARATION_GROUPS | "other";

function groupOf(code: string): Group {
  const index = ORDER.indexOf(code);
  if (index === -1) return "other";
  for (const [group, [first, last]] of Object.entries(DECLARATION_GROUPS) as Array<[Group, readonly [string, string]]>) {
    if (index >= ORDER.indexOf(first) && index <= ORDER.indexOf(last)) return group;
  }
  return "other";
}

/** The VAT-7 / VAT-7K positions, grouped as on the form, each next to its register sum where there is one. */
export function JpkDeclarationPanel({ analysis, labels, locale }: { analysis: JpkAnalysis; labels: JpkViewerLabels; locale: Locale }) {
  const { jpk, summary } = analysis;
  const declaration = jpk.declaration;
  const d = labels.declaration;

  if (!declaration) return <p className="m-0 max-w-[46rem]">{d.none}</p>;

  /* A quarterly return covers three months, so it is not set against one month's register. */
  const compare = jpk.sales !== null && jpk.structure === "JPK_V7M";
  const present = new Set<string>([...Object.keys(declaration.amounts), ...declaration.flags, ...(declaration.texts.P_61 ? ["P_61"] : [])]);
  if (compare) for (const [p, k] of DECLARATION_FROM_REGISTER) if (registerValue(summary, k) !== 0) present.add(p);

  const codes = [...present].sort((a, b) => {
    const ia = ORDER.indexOf(a);
    const ib = ORDER.indexOf(b);
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib) || a.localeCompare(b);
  });
  const groups = (["output", "input", "settlement", "extra", "other"] as const)
    .map((group) => ({ group, codes: codes.filter((code) => groupOf(code) === group) }))
    .filter((entry) => entry.codes.length);

  return (
    <div className="grid gap-7">
      <p className="m-0 text-[0.95rem] text-[var(--color-muted)] print:text-black">
        {[declaration.formCode ? `${d.form}: ${declaration.formCode}` : null, declaration.quarter ? `${d.quarter}: ${labels.quarters[declaration.quarter - 1] ?? declaration.quarter}` : null]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {jpk.structure === "JPK_V7K" ? <p className="m-0 max-w-[46rem]">{d.v7kNote}</p> : null}

      {groups.map(({ group, codes: groupCodes }) => (
        <Block key={group} title={d.groups[group]}>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse text-[0.92rem] print:text-[9pt]">
              <thead>
                <tr>
                  <th className={thClass} scope="col">{d.columns.code}</th>
                  <th className={thClass} scope="col">{d.columns.label}</th>
                  <th className={`${thClass} text-right`} scope="col">{d.columns.declared}</th>
                  {compare ? (
                    <>
                      <th className={`${thClass} text-right`} scope="col">{d.columns.register}</th>
                      <th className={`${thClass} text-right`} scope="col">{d.columns.diff}</th>
                    </>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {groupCodes.map((code) => {
                  const k = REGISTER_FIELD.get(code);
                  const declared = declaration.amounts[code];
                  const value =
                    code === "P_61" ? declaration.texts.P_61 : declaration.flags.includes(code) ? d.yes : declared === undefined ? "-" : zloty(declared, locale);
                  const register = compare && k ? registerValue(summary, k) : null;
                  const diff = register === null ? null : (declared ?? 0) - register;

                  return (
                    <tr key={code}>
                      <td className={`${tdClass} whitespace-nowrap`}>{code}</td>
                      <td className={`${tdClass} min-w-[14rem]`}>{labels.fields[code] ?? code}</td>
                      <td className={`${tdClass} ${numClass}`}>{value}</td>
                      {compare ? (
                        <>
                          <td className={`${tdClass} ${numClass}`}>{register === null ? "" : zloty(register, locale)}</td>
                          <td className={`${tdClass} ${numClass} ${diff !== null && Math.abs(diff) > 100 ? `${warnText} font-semibold` : diff ? "text-[var(--color-muted)]" : ""}`}>
                            {diff === null ? "" : diff === 0 ? "0" : zloty(diff, locale)}
                          </td>
                        </>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Block>
      ))}

      {declaration.texts.P_ORDZU ? (
        <Block title={`P_ORDZU: ${labels.fields.P_ORDZU ?? ""}`}>
          <p className="m-0 max-w-[46rem] whitespace-pre-line">{declaration.texts.P_ORDZU}</p>
        </Block>
      ) : null}
    </div>
  );
}
