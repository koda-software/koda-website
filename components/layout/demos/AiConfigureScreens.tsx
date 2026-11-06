import type { ReactNode } from "react";
import type { AiConfigureDemoContent } from "@/content/types";
import styles from "./AiConfigureDemo.module.css";

function Screen({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className={styles.screen} data-screen>
      <h3 className={styles.screenTitle}>{title}</h3>
      {children}
    </div>
  );
}

/** The asset form, which gains a field. A new field is empty on the records that already exist. */
function AssetScreen({ demo }: { demo: AiConfigureDemoContent }) {
  const { added, fields, title } = demo.asset;

  return (
    <Screen title={title}>
      <dl className={styles.fields}>
        {fields.map((field) => (
          <div className={styles.field} key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
        <div className={`${styles.field} ${styles.fresh}`} data-fresh data-grow>
          <dt>{added.label}</dt>
          <dd className={styles.unset}>{added.value}</dd>
        </div>
      </dl>
    </Screen>
  );
}

/** The ticket form, where one field goes to the top and becomes required. The markup has it there already. */
function TicketScreen({ demo }: { demo: AiConfigureDemoContent }) {
  const { fields, moved, title } = demo.ticket;

  return (
    <Screen title={title}>
      <dl className={styles.fields}>
        <div className={`${styles.field} ${styles.fresh} ${styles.moved}`} data-fresh data-moved>
          <dt>
            {moved.label}
            <span className={styles.required} data-appear> *</span>
          </dt>
          <dd>{moved.value}</dd>
        </div>
        {fields.map((field) => (
          <div className={styles.field} data-passed key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </Screen>
  );
}

/** The invoice list, which opens up for one more column. */
function InvoiceScreen({ demo }: { demo: AiConfigureDemoContent }) {
  const { added, columns, rows, title } = demo.invoices;

  return (
    <Screen title={title}>
      <div className={styles.table}>
        <div className={styles.tableHead}>
          {columns.map((column) => <span key={column}>{column}</span>)}
          <b className={`${styles.newCell} ${styles.fresh}`} data-fresh data-widen>{added}</b>
        </div>
        {rows.map(({ cells, overdue }) => (
          <div className={styles.tableRow} key={cells[0]}>
            {cells.map((cell) => <span key={cell}>{cell}</span>)}
            <b className={`${styles.newCell} ${styles.fresh}`} data-fresh data-widen>{overdue}</b>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/** What each request changes, in the order of `demo.requests`. */
export const CONFIGURE_SCREENS = [AssetScreen, TicketScreen, InvoiceScreen];
