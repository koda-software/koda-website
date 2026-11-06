/** The middle of the window, as an observer margin. */
const CENTRE_BAND = "-40% 0px -40% 0px";

/**
 * Tells a demo when to run: not until `centre`, a point in the middle of the demo,
 * has reached the middle of the screen, and from then on whenever `root` is in view.
 * Returns the function that stops watching.
 */
export function watchCentre(centre: Element, root: Element, onChange: (state: { playing: boolean; visible: boolean }) => void) {
  let started = false;
  let visible = false;
  const report = () => onChange({ playing: started && visible, visible });

  const centreObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      started = true;
      centreObserver.disconnect();
      report();
    },
    { rootMargin: CENTRE_BAND },
  );
  const viewObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      report();
    },
    { threshold: 0.3 },
  );
  centreObserver.observe(centre);
  viewObserver.observe(root);

  return () => {
    centreObserver.disconnect();
    viewObserver.disconnect();
  };
}
