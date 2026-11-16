/** The one copy button every tool uses: dark, with a copy icon that turns into a tick once copied. */
export function CopyButton({
  copied,
  label,
  copiedLabel,
  onClick,
  children,
}: {
  copied: boolean;
  label: string;
  copiedLabel: string;
  onClick: () => void;
  /** Extra content, e.g. an sr-only line saying which of several results this button copies. */
  children?: React.ReactNode;
}) {
  return (
    <button className="action action-ink cursor-pointer border-0" onClick={onClick} type="button">
      <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        {copied ? (
          <path d="m5 12 5 5 9-10" />
        ) : (
          <>
            <rect height="12" rx="2" width="12" x="9" y="9" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </>
        )}
      </svg>
      <span>{copied ? copiedLabel : label}</span>
      {children}
    </button>
  );
}
