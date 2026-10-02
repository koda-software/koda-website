import Image from 'next/image';

import { docsBasePath } from '@/lib/docs/site';

export function DocsBrand() {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="sr-only">Opero Docs</span>
      <span aria-hidden="true" className="relative block h-7 w-[92px] shrink-0">
        <Image
          src={`${docsBasePath}/_assets/branding/opero-logo.svg`}
          alt=""
          width={560}
          height={208}
          className="h-full w-full object-contain dark:hidden"
          priority
        />
        <Image
          src={`${docsBasePath}/_assets/branding/opero-logo-white.svg`}
          alt=""
          width={560}
          height={208}
          className="hidden h-full w-full object-contain dark:block"
          priority
        />
      </span>
      <span
        aria-hidden="true"
        className="rounded border border-fd-border bg-fd-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase leading-none text-fd-muted-foreground"
      >
        Docs
      </span>
    </span>
  );
}
