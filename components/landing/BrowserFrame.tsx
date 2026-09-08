import type { HTMLAttributes, ReactNode, Ref } from "react";

type BrowserFrameProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  addressClassName?: string;
  addressLabel?: string;
  browserRef?: Ref<HTMLDivElement>;
  children: ReactNode;
  chromeClassName?: string;
  chromeContent?: ReactNode;
  showAddressBar?: boolean;
  showTrailingIndicator?: boolean;
  tone?: "dark" | "light";
};

const trafficLights = ["#ff6b5f", "#ffca47", "#23c46e"];

export function BrowserFrame({
  addressClassName = "",
  addressLabel,
  browserRef,
  children,
  chromeClassName = "",
  chromeContent,
  className = "",
  showAddressBar,
  showTrailingIndicator = false,
  tone = "light",
  ...props
}: BrowserFrameProps) {
  const isDark = tone === "dark";
  const shouldShowAddressBar = showAddressBar ?? Boolean(addressLabel);
  const chromeTone = isDark
    ? "border-white/10 bg-[#0a1724]"
    : "border-[rgba(11,17,22,0.08)] bg-[rgba(250,253,255,0.97)]";
  const addressTone = isDark
    ? "bg-white/8 text-white/60"
    : "border border-[rgba(2,2,13,0.08)] bg-white text-[var(--color-muted)]";

  return (
    <div
      className={`overflow-hidden ${className}`.trim()}
      ref={browserRef}
      {...props}
    >
      <div
        className={`flex h-9 items-center gap-2 border-b px-4 ${chromeTone} ${chromeClassName}`.trim()}
      >
        <div aria-hidden="true" className="flex shrink-0 gap-1.5">
          {trafficLights.map((color) => (
            <span
              className="h-2.5 w-2.5 rounded-full"
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        {chromeContent ?? (shouldShowAddressBar ? (addressLabel ? (
          <div
            className={`ml-2 min-w-0 flex-1 rounded-full px-3 py-1 text-center font-sans text-[0.76rem] ${addressTone} ${addressClassName}`.trim()}
          >
            {addressLabel}
          </div>
        ) : (
          <span
            aria-hidden="true"
            className={`ml-4 rounded-full ${addressClassName || `h-4 w-[min(24rem,42%)] ${isDark ? "bg-white/8" : "bg-[#e9f1f7]"}`}`.trim()}
          />
        )) : null)}
        {showTrailingIndicator ? (
          <span
            aria-hidden="true"
            className={`ml-auto h-4 w-4 rounded-full ${isDark ? "bg-white/10" : "bg-[#d7edf8]"}`}
          />
        ) : null}
      </div>
      {children}
    </div>
  );
}
