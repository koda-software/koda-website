"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPage } from "@/lib/analytics/journey";

/** Notes each page the visitor opens (see lib/analytics/journey.ts). Renders nothing. */
export function JourneyTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPage(pathname);
  }, [pathname]);

  return null;
}
