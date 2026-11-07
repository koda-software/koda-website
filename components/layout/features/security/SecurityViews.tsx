import type { SecurityPageContent, SecurityViewColumn } from "@/content/feature-stories/security.types";

function ViewColumn({ absentLabel, column, recordTitle, viewOnlyLabel }: { absentLabel: string; column: SecurityViewColumn; recordTitle: string; viewOnlyLabel: string }) {
  return (
    <article className="flex flex-col rounded-[16px] border border-[rgba(11,17,22,0.12)] bg-white shadow-[0_24px_60px_-40px_rgba(7,26,43,0.45)]" data-reveal>
      <header className="border-b border-[rgba(11,17,22,0.08)] px-5 py-4">
        <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{column.role}</p>
        <h3 className="m-0 mt-2 text-[1rem] font-semibold leading-[1.3] text-[var(--color-ink)]">{recordTitle}</h3>
      </header>
      <dl className="m-0 grid gap-3.5 px-5 py-5">
        {column.fields.map((field) => (
          <div key={field.label}>
            <dt className="text-[0.74rem] text-[var(--color-muted)]">{field.label}</dt>
            <dd className="m-0 mt-0.5 text-[0.94rem] font-medium text-[var(--color-ink)]">{field.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto px-5 pb-5">
        {column.absent.length > 0 ? (
          <p className="m-0 rounded-[10px] border border-dashed border-[rgba(11,17,22,0.18)] px-3 py-2.5 text-[0.78rem] leading-[1.45] text-[var(--color-muted)]">
            <span className="font-medium text-[var(--color-ink-soft)]">{absentLabel}</span> {column.absent.join(", ")}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {column.actions.length > 0 ? (
            column.actions.map((action, index) => (
              <span className={`rounded-[8px] px-3 py-1.5 text-[0.8rem] font-medium ${index === 0 ? "bg-[#1e5278] text-white" : "border border-[rgba(11,17,22,0.16)] text-[var(--color-ink-soft)]"}`} key={action}>
                {action}
              </span>
            ))
          ) : (
            <span className="rounded-[8px] bg-[var(--color-mist)] px-3 py-1.5 text-[0.8rem] font-medium text-[var(--color-muted)]">{viewOnlyLabel}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/** The same record as three people get it: a field off someone's form is not masked, it is simply not there. */
export function SecurityViews({ views }: { views: SecurityPageContent["views"] }) {
  return (
    <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1" data-arrive>
      {views.columns.map((column) => (
        <ViewColumn absentLabel={views.absentLabel} column={column} key={column.role} recordTitle={views.recordTitle} viewOnlyLabel={views.viewOnlyLabel} />
      ))}
    </div>
  );
}
