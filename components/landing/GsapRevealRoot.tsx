"use client";

import { type ReactNode, useRef } from "react";
import { useGsapReveal } from "./useGsapReveal";

type GsapRevealRootProps = {
  children: ReactNode;
  className?: string;
  duration?: number;
  selector?: string;
  stagger?: number;
  start?: string;
  x?: number;
  y?: number;
};

export function GsapRevealRoot({
  children,
  className = "",
  duration,
  selector,
  stagger,
  start,
  x,
  y,
}: GsapRevealRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsapReveal(rootRef, {
    duration,
    selector,
    stagger,
    start,
    x,
    y,
  });

  return (
    <div className={className} ref={rootRef}>
      {children}
    </div>
  );
}
