/** The "what happens to your data" line under each tool, with a shield so it reads as a promise, not fine print. */
export function PrivacyNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`m-0 flex max-w-[52rem] items-start gap-2.5 text-[0.92rem] leading-[1.55] text-[var(--color-muted)] ${className}`}>
      <svg
        aria-hidden="true"
        className="mt-[2px] h-[18px] w-[18px] shrink-0 text-[#1f7a4d]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.1 7.5 9.5 4.4-1.4 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m8.8 12.2 2.2 2.2 4.2-4.6" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
