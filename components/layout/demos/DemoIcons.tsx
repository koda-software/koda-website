/**
 * The icon sprite the demo markup references with `<use href="#oa-i-...">`.
 * Rendered once per demo by `DemoStage`. Ids carry an `oa-` prefix so they
 * cannot collide with any other inline SVG on the page.
 */
export function DemoIcons() {
  return (
    <svg
      aria-hidden="true"
      height="0"
      style={{ position: "absolute" }}
      width="0"
    >
      <defs>
        <symbol id="oa-i-check" viewBox="0 0 24 24">
          <path d="m5 12.5 4.5 4.5L19 7" />
        </symbol>
        <symbol id="oa-i-arrow" viewBox="0 0 24 24">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </symbol>
        <symbol id="oa-i-arrow-l" viewBox="0 0 24 24">
          <path d="M20 12H5M11 6l-6 6 6 6" />
        </symbol>
        <symbol id="oa-i-bell" viewBox="0 0 24 24">
          <path d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 2.5h15z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </symbol>
        <symbol id="oa-i-lock" viewBox="0 0 24 24">
          <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
          <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
        </symbol>
        <symbol id="oa-i-file" viewBox="0 0 24 24">
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4" />
        </symbol>
        <symbol id="oa-i-mail" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </symbol>
        <symbol id="oa-i-user" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </symbol>
        <symbol id="oa-i-db" viewBox="0 0 24 24">
          <ellipse cx="12" cy="6" rx="7.5" ry="3" />
          <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
          <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
        </symbol>
        <symbol id="oa-i-chart" viewBox="0 0 24 24">
          <path d="M4 20h16M7 20V11M12 20V5M17 20v-7" />
        </symbol>
        <symbol id="oa-i-bolt" viewBox="0 0 24 24">
          <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />
        </symbol>
        <symbol id="oa-i-text" viewBox="0 0 24 24">
          <path d="M5 6h14M9 6v13M5 12h8" />
        </symbol>
        <symbol id="oa-i-list" viewBox="0 0 24 24">
          <path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
        </symbol>
        <symbol id="oa-i-cal" viewBox="0 0 24 24">
          <rect x="4" y="5" width="16" height="16" rx="2.5" />
          <path d="M4 10h16M8.5 3v4M15.5 3v4" />
        </symbol>
        <symbol id="oa-i-hash" viewBox="0 0 24 24">
          <path d="M6 9h13M5 15h13M10 4 8 20M17 4l-2 16" />
        </symbol>
        <symbol id="oa-i-clip" viewBox="0 0 24 24">
          <path d="M20 11.5 12 19.5a5 5 0 0 1-7-7l8.5-8.5a3.4 3.4 0 0 1 4.8 4.8l-8.4 8.4a1.8 1.8 0 0 1-2.5-2.5l7.8-7.8" />
        </symbol>
        <symbol id="oa-i-eye-off" viewBox="0 0 24 24">
          <path d="M4 4l16 16" />
          <path d="M9.9 5.4A9 9 0 0 1 21 12a13 13 0 0 1-3 3.6M6.6 6.7A13 13 0 0 0 3 12a9 9 0 0 0 12 6.4" />
        </symbol>
        <symbol id="oa-i-spark" viewBox="0 0 24 24">
          <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13 4.5 11l5.6-2z" />
          <path d="M18.5 3.5v3M17 5h3" />
        </symbol>
        <symbol id="oa-i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </symbol>
      </defs>
    </svg>
  );
}
