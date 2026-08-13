"use client";

import { createContext, type ReactNode, useContext } from "react";
import styles from "./demoShell.module.css";

/**
 * Which named view the timeline currently has on screen. Demos that only ever
 * show one view still render a `DemoView`, so a single code path handles both.
 */
export const DemoViewContext = createContext<string | null>(null);

export function DemoView({ children, name }: { children: ReactNode; name: string }) {
  const active = useContext(DemoViewContext);

  return <section className={`${styles.view} ${active === name ? styles.on : ""}`}>{children}</section>;
}
