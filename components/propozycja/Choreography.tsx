"use client";

import { useEffect } from "react";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type SplitTextStatic = typeof import("gsap/SplitText").SplitText;

/**
 * The motion engine for every page of the proposal.
 *
 * It reads the server-rendered page through `data-*` hooks and choreographs
 * whatever it finds, so the same engine serves the home page, the system
 * pages and everything else: a scene is recognised by `data-kind`, not by
 * which page it is on. Nothing in the markup depends on it. Every scene is a
 * complete, readable layout before it runs, and if it never runs nothing is
 * left hidden.
 *
 * Three modes, chosen by `gsap.matchMedia` and torn down cleanly when the
 * window crosses between them:
 *
 * - cinematic: a large enough screen and motion allowed. Cuts between
 *   scenes, two pinned showcases, and sequences that play as you pass.
 * - compact: phones, tablets and short laptop screens. Openings, reveals and
 *   the play-once sequences; nothing is pinned.
 * - reduce: the reader asked for less motion, and nothing moves.
 *
 * What changed after the first round of feedback: the page scrolls natively
 * (no smooth-scroll layer), and only the process and the module showcase are
 * pinned, because they are the two scenes where the scroll is genuinely the
 * control. Everything else plays while it passes, so the page can be skimmed
 * without being made to sit through it.
 */
export function Choreography() {
  useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);
      teardown = run(gsap, ScrollTrigger, SplitText);
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ setup */

function run(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, SplitText: SplitTextStatic) {
  const root = document.querySelector<HTMLElement>(".op");
  if (!root) return undefined;

  const roles = setUpRoles(root);
  const accordions = setUpAccordions(root);
  const mm = gsap.matchMedia();

  mm.add(
    {
      cinematic: "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",
      compact: "(prefers-reduced-motion: no-preference) and ((max-width: 1023px) or (max-height: 719px))",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { cinematic, compact } = context.conditions as Record<string, boolean>;
      const cleanups: Array<() => void> = [];
      if (!cinematic && !compact) return undefined;

      heroIntro(gsap, root);

      if (cinematic) {
        root.classList.add("is-cinematic");
        cleanups.push(() => root.classList.remove("is-cinematic"));

        /* Pinned showcases first and in page order, so every trigger created
           after them measures positions with their pin spacing in place. */
        each(root, "scatter", (scene) => cleanups.push(scatterScene(gsap, ScrollTrigger, scene)));
        each(root, "foundation", (scene) => cleanups.push(foundationScene(gsap, scene)));
        each(root, "process", (scene) => processScene(gsap, scene));
        each(root, "build", (scene) => buildScene(gsap, scene));

        cuts(gsap, root);
        heroParallax(gsap, root);
      }

      each(root, "ai", (scene) => cleanups.push(aiScene(gsap, ScrollTrigger, SplitText, scene, Boolean(cinematic))));
      each(root, "control", (scene) => controlScene(gsap, ScrollTrigger, scene, roles));
      showcases(gsap, ScrollTrigger, root);
      reveals(gsap, ScrollTrigger, root);
      paths(gsap, root, Boolean(compact));

      ScrollTrigger.refresh();
      return () => cleanups.forEach((cleanup) => cleanup());
    },
  );

  return () => {
    mm.revert();
    roles.dispose();
    accordions();
  };
}

/* ------------------------------------------------------------------ helpers */

const q = <T extends Element = HTMLElement>(scope: ParentNode, selector: string) => scope.querySelector<T>(selector);
const qa = <T extends Element = HTMLElement>(scope: ParentNode, selector: string) =>
  Array.from(scope.querySelectorAll<T>(selector));
const each = (root: HTMLElement, kind: string, fn: (scene: HTMLElement) => void) =>
  qa(root, `[data-kind="${kind}"]`).forEach(fn);

/** Plays a timeline once, when its scene is properly on screen. */
function playOnEnter(ScrollTrigger: ScrollTriggerStatic, trigger: Element, tl: { play: () => unknown }, start = "top 55%") {
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => tl.play() });
}

/* ------------------------------------------------------------------ openings */

/*
 * Every page opens on its banner, on a clock rather than the scroll: it is on
 * screen at load. The headline rises out of its own baseline line by line,
 * the rest follows, and on the home page the screen on the right assembles
 * and steps its case onto the second stage.
 */
function heroIntro(gsap: Gsap, root: HTMLElement) {
  const hero = q(root, '[data-kind="hero"], [data-kind="page-hero"]');
  if (!hero) return;

  const lines = qa(hero, "[data-hero-line]");
  const fades = qa(hero, "[data-hero-fade]");
  const visual = qa(hero, "[data-hero-window], [data-hero-visual]");
  const pieces = qa(hero, "[data-hero-piece], [data-hero-stages], [data-hero-field]");
  const pills = qa(hero, "[data-hero-stages] .stage");
  const toast = q(hero, "[data-hero-toast]");

  const setStage = (current: number) =>
    pills.forEach((pill, index) => {
      pill.dataset.state = index < current ? "done" : index === current ? "current" : "future";
    });

  /* `y: 0` is not redundant: GSAP reads the stylesheet's pre-paint
     `translateY(110%)` into its own pixel cache the first time it touches the
     line, and that offset would otherwise stay behind. */
  gsap.set(lines, { y: 0, yPercent: 110 });
  gsap.set(fades, { autoAlpha: 0, y: 24 });
  gsap.set(visual, { autoAlpha: 0, y: 60, scale: 0.96 });
  gsap.set(pieces, { autoAlpha: 0, y: 14 });
  if (toast) gsap.set(toast, { autoAlpha: 0, y: 30, scale: 0.92 });
  if (pills.length) setStage(-1);
  root.classList.add("hero-ready");

  const tl = gsap
    .timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
    .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0)
    .to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 0.35)
    .to(visual, { autoAlpha: 1, y: 0, scale: 1, duration: 1.3 }, 0.45)
    .to(pieces, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.85);

  if (pills.length) {
    tl.call(() => setStage(0), undefined, 1.45).call(() => setStage(1), undefined, 2.05);
  }
  if (toast) tl.to(toast, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.3)" }, 2.15);
}

function heroParallax(gsap: Gsap, root: HTMLElement) {
  const hero = q(root, '[data-kind="hero"]');
  if (!hero) return;
  const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  /* The screen leaves faster than the words, so the two separate in depth. */
  gsap.to(q(hero, "[data-hero-canvas]"), { y: -160, ease: "none", scrollTrigger: scrub });
  gsap.to(q(hero, ".hero__copy"), { y: -60, autoAlpha: 0.25, ease: "none", scrollTrigger: { ...scrub } });
}

/* ------------------------------------------------------------------ cuts */

/*
 * The cut each scene declares in `data-cut`. See `Scene.tsx` for what each
 * one is for; the point of having several is that the page stops reading as
 * a sequence of identical slides.
 */
function cuts(gsap: Gsap, root: HTMLElement) {
  const scenes = qa(root, "[data-scene]");

  scenes.forEach((section, index) => {
    if (index === 0) return;
    const frame = q(section, ".scene__frame");
    const inner = q(section, ".scene__inner");
    const enter = { trigger: section, start: "top bottom", end: "top top", scrub: true };

    switch (section.dataset.cut) {
      case "card":
        gsap.fromTo(
          frame,
          { clipPath: "inset(9% 5% 0% 5% round 48px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: enter },
        );
        gsap.fromTo(inner, { y: 90 }, { y: 0, ease: "none", scrollTrigger: { ...enter } });
        break;

      case "wipe":
        /* Done by the time the section's top is a little above the middle,
           so the diagonal never cuts through text that is being read. */
        gsap.fromTo(
          frame,
          { clipPath: "polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)" },
          { clipPath: "polygon(0% 0%, 130% 0%, 100% 100%, 0% 100%)", ease: "none", scrollTrigger: { ...enter, end: "top 40%" } },
        );
        break;

      case "curtain": {
        /* The scene slides over the one above with a shadow on its edge.
           Only a full-screen staged scene also sinks and dims behind it: a
           section of text would be dimmed while its last lines are still
           being read, which is exactly what made the long texts look greyed
           out. */
        const above = scenes[index - 1];
        section.classList.add("has-curtain");
        if (above.dataset.stage !== undefined) {
          gsap.to(q(above, ".scene__inner"), {
            y: () => window.innerHeight * 0.32,
            autoAlpha: 0.25,
            scale: 0.96,
            ease: "none",
            scrollTrigger: { ...enter, invalidateOnRefresh: true },
          });
        }
        break;
      }

      case "fade":
        /* The section is painted in the previous scene's colour; fading the
           frame in over it changes the colour of the page itself. It is
           complete before the section reaches the middle of the window, so
           nothing is read through a half-transparent veil. */
        gsap.fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", scrollTrigger: { ...enter, start: "top 95%", end: "top 55%" } });
        gsap.fromTo(inner, { y: 50 }, { y: 0, ease: "none", scrollTrigger: { ...enter, start: "top 95%", end: "top 55%" } });
        break;

      case "iris":
        gsap.fromTo(
          frame,
          { clipPath: "circle(0% at 50% 100%)" },
          { clipPath: "circle(150% at 50% 100%)", ease: "none", scrollTrigger: { ...enter, end: "top 5%" } },
        );
        break;

      default:
        break;
    }
  });
}

/* ------------------------------------------------------------------ scatter */

function scatterScene(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, scene: HTMLElement) {
  const field = q(scene, "[data-scatter-field]");
  if (!field) return () => undefined;

  const frags = qa(scene, "[data-frag]");
  const chaos = qa(scene, ".frag__face--chaos");
  const order = qa(scene, ".frag__face--order");
  const lines = qa(scene, "[data-scatter-line]");
  const resolve = qa(scene, "[data-scatter-resolve]");
  const frame = q(scene, "[data-system-frame]");
  const label = q(scene, "[data-system-label]");

  const cols = 3;
  const rows = 4;
  const area = () => {
    const w = field.clientWidth;
    const h = field.clientHeight;
    return { x: w * 0.5, y: h * 0.12, w: w * 0.5, h: h * 0.84 };
  };
  const slot = (index: number) => {
    const a = area();
    const cw = a.w / cols;
    const ch = a.h / rows;
    return { x: a.x + ((index % cols) + 0.5) * cw, y: a.y + (Math.floor(index / cols) + 0.5) * ch, w: cw - 16 };
  };
  const origin = (el: HTMLElement) => ({
    x: (field.clientWidth * parseFloat(el.style.getPropertyValue("--x"))) / 100,
    y: (field.clientHeight * parseFloat(el.style.getPropertyValue("--y"))) / 100,
  });

  const layoutFrame = () => {
    const a = area();
    const pad = 22;
    gsap.set(frame, { left: field.offsetLeft + a.x - pad, top: field.offsetTop + a.y - pad, width: a.w + pad * 2, height: a.h + pad * 2 });
    gsap.set(label, { left: field.offsetLeft + a.x - pad + 20, top: field.offsetTop + a.y - pad - 30 });
  };
  layoutFrame();
  ScrollTrigger.addEventListener("refresh", layoutFrame);

  frags.forEach((el) => gsap.set(el, { xPercent: -50, yPercent: -50, rotation: Number(el.dataset.r) || 0 }));
  gsap.set(label, { y: 10 });

  /* Not pinned: the pieces converge while the scene passes through the
     window, so a reader who scrolls on is never held back by it. */
  gsap
    .timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: { trigger: scene, start: "top 70%", end: "top -25%", scrub: 0.6, invalidateOnRefresh: true },
    })
    .from(lines, { autoAlpha: 0.15, y: 30, stagger: 0.18, duration: 0.5 }, 0)
    .to(frags, { y: (index) => -(24 + (index % 4) * 26), duration: 0.8, ease: "none" }, 0)
    .to(
      frags,
      {
        x: (index, el: HTMLElement) => slot(index).x - origin(el).x,
        y: (index, el: HTMLElement) => slot(index).y - origin(el).y,
        width: (index) => slot(index).w,
        rotation: 0,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: { each: 0.035, from: "random" },
      },
      0.7,
    )
    .to(chaos, { autoAlpha: 0, duration: 0.35, stagger: 0.02 }, 1.7)
    .to(order, { autoAlpha: 1, duration: 0.35, stagger: 0.02 }, 1.7)
    .to(frame, { autoAlpha: 1, duration: 0.4 }, 1.9)
    .to(label, { autoAlpha: 1, y: 0, duration: 0.4 }, 2)
    .to(lines, { autoAlpha: 0.12, duration: 0.4 }, 2)
    .from(resolve, { autoAlpha: 0, y: 40, stagger: 0.12, duration: 0.5, ease: "power3.out" }, 2.1);

  return () => ScrollTrigger.removeEventListener("refresh", layoutFrame);
}

/* ------------------------------------------------------------------ foundation */

function foundationScene(gsap: Gsap, scene: HTMLElement) {
  const mark = q<SVGSVGElement>(scene, "[data-mark] svg");
  const faceOf = (face: string) => q<SVGGElement>(scene, `[data-face="${face}"]`);
  const tilesOf = (face: string) => qa<SVGPolygonElement>(scene, `[data-face="${face}"] [data-tile]`);
  const partOf = (face: string) => q(scene, `[data-part="${face}"]`);
  const solids = qa<SVGPolygonElement>(scene, ".mark__solid");
  const allTiles = qa<SVGPolygonElement>(scene, "[data-tile]");
  const ring = q<SVGCircleElement>(scene, "[data-ring]");
  const parts = qa(scene, "[data-part]");
  const copy = q(scene, ".foundation__copy");
  const legend = q(scene, ".parts");
  const portal = q(scene, "[data-portal]");
  if (!mark) return () => undefined;

  /* The portal opens from the hexagonal opening at the centre of the mark. */
  const placePortal = () => {
    const parent = portal?.offsetParent;
    if (!portal || !parent) return;
    const box = mark.getBoundingClientRect();
    const frame = parent.getBoundingClientRect();
    gsap.set(portal, { left: box.left - frame.left + box.width / 2, top: box.top - frame.top + box.height / 2 });
  };
  placePortal();
  window.addEventListener("resize", placePortal);
  const cover = () => (Math.hypot(window.innerWidth, window.innerHeight) * 2.4) / 40;

  /* Apart: each face pulled out along its own direction and not yet there,
     its modules already seamed into it, the circle not drawn, and the names
     around the mark waiting. */
  const away: Record<string, gsap.TweenVars> = { lw: { x: -6, y: 3.5 }, rw: { x: 6, y: 3.5 }, lid: { y: -7 } };
  Object.entries(away).forEach(([face, vars]) => gsap.set(faceOf(face), { ...vars, autoAlpha: 0 }));
  gsap.set(allTiles, { scale: 0.86, transformOrigin: "50% 50%" });
  gsap.set(solids, { autoAlpha: 0 });
  if (ring) gsap.set(ring, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(parts, { autoAlpha: 0.25 });

  /* Data and screens, then processes, then the applications on top: each
     face glides home in one movement while its modules settle into place,
     and its name lights up. No bounce and no random order - the mark is
     assembled, not scattered. */
  const tl = gsap.timeline({ scrollTrigger: { trigger: scene, start: "top 75%", end: "top -10%", scrub: 0.8 } });
  ["lw", "rw", "lid"].forEach((face, index) => {
    const t = index * 0.9;
    tl.to(faceOf(face), { autoAlpha: 1, duration: 0.35, ease: "none" }, t)
      .to(faceOf(face), { x: 0, y: 0, duration: 1, ease: "power2.out" }, t)
      .to(tilesOf(face), { scale: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" }, t + 0.1)
      .to(partOf(face), { autoAlpha: 1, duration: 0.3 }, t + 0.2);
  });
  /* Control last, drawn around everything, and the seams close: the modules
     have become the mark. */
  if (ring) tl.to(ring, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, 2.8);
  tl.to(partOf("ring"), { autoAlpha: 1, duration: 0.3 }, 2.9)
    .to(allTiles, { strokeWidth: 0, duration: 0.6, ease: "power1.inOut" }, 3.5)
    .to(solids, { autoAlpha: 1, duration: 0.6, ease: "power1.inOut" }, 3.5);

  /* On the way out the camera goes through the opening in the mark: the mist
     opens from its centre and the process chapter continues on that colour. */
  if (portal) {
    gsap
      .timeline({ scrollTrigger: { trigger: scene, start: "bottom 92%", end: "bottom 22%", scrub: 0.6, invalidateOnRefresh: true } })
      .to([copy, legend], { autoAlpha: 0, y: -40, duration: 0.5, ease: "power2.in" }, 0)
      .to(mark, { scale: 3.2, duration: 0.8, ease: "power2.in" }, 0.15)
      .to(portal, { scale: cover, duration: 0.65, ease: "power2.in" }, 0.4);
  }

  return () => window.removeEventListener("resize", placePortal);
}

/* ------------------------------------------------------------------ process (pinned) */

function processScene(gsap: Gsap, scene: HTMLElement) {
  const beats = qa(scene, "[data-beat]");
  const row = q(scene, ".stages--cursor");
  if (!row || !beats.length) return;
  const mask = row.parentElement as HTMLElement;
  const pills = qa(row, ".stage");
  const cursor = q(row, ".stages__cursor");
  const logs = qa(scene, "[data-log]");
  const valueField = q(scene, '[data-process-field="value"]');
  const last = beats.length - 1;

  const pill = (index: number) => ({ x: pills[index].offsetLeft, w: pills[index].offsetWidth });
  const shift = (index: number) => {
    const view = mask.clientWidth - 52;
    const centre = pill(index).x + pill(index).w / 2;
    const min = Math.min(0, view - row.scrollWidth);
    return Math.max(min, Math.min(0, view * 0.42 - centre));
  };
  const show = (current: number) => {
    pills.forEach((el, index) => {
      el.dataset.state = index < current ? "done" : index === current ? "current" : "future";
    });
    logs.forEach((el, index) => {
      el.dataset.shown = String(index <= current);
    });
    valueField?.classList.toggle("field--focus", current === 2);
  };

  gsap.set(cursor, { x: () => pill(0).x, width: () => pill(0).w });
  gsap.set(beats.slice(1), { autoAlpha: 0, y: 40 });
  show(0);

  /* One of the two pinned scenes: here the scroll is the control that moves
     the contract, which is the whole point of the chapter. Three screens of
     scroll for five stages - long enough to read each, short enough not to
     feel held. */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      /* When the reader stops, the contract settles on the nearest stage
         instead of resting halfway between two of them, with one stage
         fading out and the next not yet in. */
      snap: {
        snapTo: (progress: number) => {
          const total = tl.duration();
          const rests = beats.map((_, index) => (index === 0 ? 0 : (index + 0.15) / total));
          return rests.reduce((best, rest) => (Math.abs(rest - progress) < Math.abs(best - progress) ? rest : best), 0);
        },
        duration: { min: 0.25, max: 0.6 },
        delay: 0.08,
        /* the nearest stage to where the reader stopped, not to where a fast
           flick would have carried the page */
        inertia: false,
        ease: "power2.inOut",
      },
      onUpdate: () => show(Math.max(0, Math.min(last, Math.floor(tl.time() + 0.3)))),
    },
  });

  /* Each change of stage is a clean hand-over: the old beat is gone before
     the new one arrives, so no frame shows two stages on top of each other. */
  for (let index = 1; index <= last; index += 1) {
    const at = index - 1 + 0.3;
    tl.to(beats[index - 1], { autoAlpha: 0, y: -40, duration: 0.35, ease: "power2.in" }, at)
      .fromTo(beats[index], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, at + 0.4)
      .to(cursor, { x: () => pill(index).x, width: () => pill(index).w, duration: 0.6, ease: "power3.inOut" }, at + 0.1)
      .to(row, { x: () => shift(index), duration: 0.6, ease: "power3.inOut" }, at + 0.1);
  }
  tl.to({}, { duration: 0.4 });
}

/* ------------------------------------------------------------------ build (pinned) */

function buildScene(gsap: Gsap, scene: HTMLElement) {
  const board = q(scene, "[data-board]");
  if (!board) return;

  const recs = qa(board, "[data-rec]");
  const blocks = qa(scene, "[data-block]");
  const tabs = qa(scene, "[data-view-tab]");
  const guidesBoard = q(scene, '[data-guides="board"]');
  const guidesCalendar = q(scene, '[data-guides="calendar"]');
  const words = qa(scene, "[data-roller-word]");

  const pad = { x: 22, y: 18 };
  const width = () => board.clientWidth - pad.x * 2;
  const height = () => board.clientHeight - pad.y - 22;
  type Box = { x: number; y: number; width: number; height: number };
  const list = (index: number): Box => ({ x: pad.x, y: pad.y + index * 54, width: width(), height: 46 });
  const columnRank = (index: number) => recs.slice(0, index).filter((el) => el.dataset.col === recs[index].dataset.col).length;
  const kanban = (index: number): Box => {
    const colW = (width() - 20) / 3;
    const col = Number(recs[index].dataset.col);
    return { x: pad.x + col * (colW + 10), y: pad.y + 42 + columnRank(index) * 66, width: colW, height: 58 };
  };
  const calendar = (index: number): Box => {
    const day = Number(recs[index].dataset.day);
    const cw = (width() - 24) / 7;
    const ch = (height() - 12) / 4;
    const c = (day - 1) % 7;
    const r = Math.floor((day - 1) / 7);
    return { x: pad.x + c * (cw + 4) + 3, y: pad.y + r * (ch + 4) + 19, width: cw - 6, height: ch - 22 };
  };
  const to = (layout: (index: number) => Box) => ({
    x: (index: number) => layout(index).x,
    y: (index: number) => layout(index).y,
    width: (index: number) => layout(index).width,
    height: (index: number) => layout(index).height,
  });
  const setView = (view: number) => {
    board.dataset.view = ["list", "board", "calendar"][view];
    tabs.forEach((tab, index) => {
      tab.dataset.active = String(index === view);
    });
  };

  gsap.set(recs, to(list));
  gsap.set(words, { yPercent: 110 });
  gsap.set(words[0], { yPercent: 0 });
  setView(0);

  /* The other pinned scene: the same records travelling between three views
     only makes sense if the reader drives it. */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: "top top",
      end: "+=220%",
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: () => {
        const t = tl.time();
        setView(t < 1.75 ? 0 : t < 2.95 ? 1 : 2);
      },
    },
  });

  tl.to(blocks, { backgroundColor: "#0b1116", color: "#f2f5f7", duration: 0.25, stagger: 0.12 }, 0)
    .from(recs, { autoAlpha: 0, scale: 0.96, duration: 0.35, stagger: 0.06 }, 0.55)
    .to(recs, { ...to(kanban), duration: 0.9, ease: "power3.inOut", stagger: 0.04 }, 1.3)
    .to(guidesBoard, { autoAlpha: 1, duration: 0.4 }, 1.5)
    .to(guidesBoard, { autoAlpha: 0, duration: 0.3 }, 2.5)
    .to(recs, { ...to(calendar), duration: 0.9, ease: "power3.inOut", stagger: 0.04 }, 2.5)
    .to(guidesCalendar, { autoAlpha: 1, duration: 0.4 }, 2.65)
    .to({}, { duration: 0.4 });

  words.forEach((word, index) => {
    if (index === 0) return;
    const at = index * 0.62;
    tl.to(words[index - 1], { yPercent: -110, duration: 0.3, ease: "power3.inOut" }, at).to(word, { yPercent: 0, duration: 0.3, ease: "power3.inOut" }, at);
  });
}

/* ------------------------------------------------------------------ ai (plays on arrival) */

function aiScene(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, SplitText: SplitTextStatic, scene: HTMLElement, cinematic: boolean) {
  const prompt = q(scene, "[data-prompt]");
  if (!prompt) return () => undefined;

  const split = SplitText.create(prompt, { type: "words,chars", charsClass: "char" });
  const wrap = q(scene, "[data-proposed-wrap]");
  const proposed = q(scene, "[data-proposed]");
  const checks = qa(scene, "[data-check]");
  const button = q(scene, "[data-approve]");
  const buttonLabel = q(scene, "[data-approve-label]");
  const note = q(scene, "[data-approve-note]");
  const chip = q(scene, "[data-proposal-chip]");
  const original = { button: buttonLabel?.textContent ?? "", note: note?.textContent ?? "", chip: chip?.textContent ?? "" };

  const approve = (approved: boolean) => {
    if (!proposed) return;
    proposed.dataset.approved = String(approved);
    if (buttonLabel) buttonLabel.textContent = approved ? "Zatwierdzone" : original.button;
    if (note) note.textContent = approved ? "Zmianę zatwierdził administrator." : original.note;
    if (chip) chip.textContent = approved ? "Zmiana wprowadzona" : original.chip;
  };

  gsap.set(split.chars, { autoAlpha: 0 });
  gsap.set(checks, { autoAlpha: 0, x: -14 });
  gsap.set(wrap, { maxWidth: 0 });
  gsap.set(proposed, { autoAlpha: 0, scale: 0.8 });

  /* A sequence on a clock, started once the scene is on screen: the request
     types itself, the proposal opens a gap in the process, the checks pass,
     and a person approves. It takes about five seconds and does not hold the
     page while it runs. */
  const tl = gsap
    .timeline({ paused: true })
    .to(split.chars, { autoAlpha: 1, duration: 0.01, stagger: { each: 1.5 / Math.max(1, split.chars.length) }, ease: "none" }, 0)
    .to(wrap, { maxWidth: () => `${(proposed?.scrollWidth ?? 160) + 12}px`, duration: 0.6, ease: "power3.inOut" }, 1.8)
    .to(proposed, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 2)
    .to(checks, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.4, ease: "power3.out" }, 2.6)
    .to(button, { scale: 0.95, duration: 0.1 }, 4.1)
    .call(() => approve(true), undefined, 4.2)
    .to(button, { scale: 1, duration: 0.35, ease: "back.out(2.2)" }, 4.2);

  playOnEnter(ScrollTrigger, scene, tl, cinematic ? "top 45%" : "top 70%");

  return () => {
    approve(false);
    split.revert();
  };
}

/* ------------------------------------------------------------------ control (plays on arrival) */

type Roles = { set: (role: string, byReader?: boolean) => void; lockedByReader: () => boolean; dispose: () => void };

/*
 * The role switch. An interaction, not an animation, so it works in every
 * mode. The page flips it once on its own as the scene arrives, but only
 * until the reader has touched it.
 */
function setUpRoles(root: HTMLElement): Roles {
  const hosts = qa(root, "[data-roles]");
  let touched = false;
  const cleanups: Array<() => void> = [];

  const placeThumb = (host: HTMLElement) => {
    const buttons = qa<HTMLButtonElement>(host, "[data-role-button]");
    const thumb = q(host, "[data-toggle-thumb]");
    const active = buttons.find((button) => button.getAttribute("aria-pressed") === "true");
    if (!active || !thumb) return;
    thumb.style.width = `${active.offsetWidth}px`;
    thumb.style.transform = `translateX(${active.offsetLeft - 4}px)`;
  };

  const setOn = (host: HTMLElement, role: string) => {
    host.dataset.role = role;
    qa(host, "[data-role-button]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.roleButton === role)));
    placeThumb(host);
  };

  hosts.forEach((host) => {
    const onClick = (event: Event) => {
      touched = true;
      setOn(host, (event.currentTarget as HTMLElement).dataset.roleButton ?? "cfo");
    };
    qa(host, "[data-role-button]").forEach((button) => button.addEventListener("click", onClick));
    q(host, ".toggle")?.setAttribute("data-js", "");
    placeThumb(host);
    cleanups.push(() => qa(host, "[data-role-button]").forEach((button) => button.removeEventListener("click", onClick)));
  });

  const onResize = () => hosts.forEach(placeThumb);
  window.addEventListener("resize", onResize);

  return {
    set: (role, byReader = false) => {
      if (byReader) touched = true;
      hosts.forEach((host) => setOn(host, role));
    },
    lockedByReader: () => touched,
    dispose: () => {
      cleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("resize", onResize);
    },
  };
}

function controlScene(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, scene: HTMLElement, roles: Roles) {
  const caps = qa(scene, "[data-cap]");
  const logs = qa(scene, "[data-control-log]");
  gsap.set(caps, { autoAlpha: 0, y: 12 });
  logs.forEach((line) => {
    line.dataset.shown = "false";
  });

  const tl = gsap
    .timeline({ paused: true })
    .to(caps, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out" }, 0)
    .call(
      () => {
        if (!roles.lockedByReader()) roles.set("assistant");
      },
      undefined,
      1.6,
    );
  logs.forEach((line, index) => {
    tl.call(
      () => {
        line.dataset.shown = "true";
      },
      undefined,
      0.3 + index * 0.35,
    );
  });

  playOnEnter(ScrollTrigger, scene, tl);
}

/* ------------------------------------------------------------------ system showcases */

/*
 * The product cards drawn for the system pages. Each one is a short
 * sequence played once when it arrives: the document collecting its
 * versions, the rule lighting its steps, the invoice filling its fields, the
 * chart's bar opening into the cases behind it.
 */
function showcases(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, root: HTMLElement) {
  qa(root, "[data-showcase]").forEach((card) => {
    const steps = qa(card, "[data-step]");
    const bars = qa(card, "[data-bar]");
    if (!steps.length && !bars.length) return;

    gsap.set(steps, { autoAlpha: 0, y: 14 });
    gsap.set(bars, { scaleY: 0, transformOrigin: "50% 100%" });

    const start = bars.length ? 0.6 : 0;
    const tl = gsap
      .timeline({ paused: true })
      .to(bars, { scaleY: 1, duration: 0.8, stagger: 0.06, ease: "expo.out" }, 0)
      .to(steps, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.32, ease: "expo.out" }, start);

    /* Cards that light one step at a time move the highlight along. */
    steps.forEach((step, index) => {
      tl.call(
        () => {
          steps.forEach((other) => other.classList.toggle("is-lit", other === step));
        },
        undefined,
        start + index * 0.32 + 0.2,
      );
    });

    playOnEnter(ScrollTrigger, card, tl, "top 75%");
  });
}

/* ------------------------------------------------------------------ paths and reveals */

function paths(gsap: Gsap, root: HTMLElement, vertical: boolean) {
  qa(root, "[data-path]").forEach((path) => {
    gsap.fromTo(
      q(path, "[data-path-fill]"),
      vertical ? { scaleY: 0 } : { scaleX: 0 },
      {
        ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
        ease: "none",
        scrollTrigger: { trigger: path, start: "top 82%", end: "top 30%", scrub: true },
      },
    );
    gsap.from(qa(path, "[data-path-step]"), {
      autoAlpha: 0,
      y: 24,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: path, start: "top 80%", once: true },
    });
  });
}

/*
 * Headlines and the few blocks marked `data-reveal="scale"` rise into place as
 * they arrive. Everything else marked `data-reveal` is simply there: copy,
 * lists and cards that fade up one by one are the motion every template site
 * ships with, and here the motion is kept for the things the product does.
 * Created after the pins, so trigger points account for the pinned scroll.
 */
function reveals(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic, root: HTMLElement) {
  const targets = qa(root, "[data-reveal]").filter((el) => el.dataset.reveal === "scale" || el.matches("h1, h2, h3, .title, .title *"));
  targets.forEach((el) => gsap.set(el, el.dataset.reveal === "scale" ? { autoAlpha: 0, scale: 0.96, y: 30 } : { autoAlpha: 0, y: 30 }));

  ScrollTrigger.batch(targets, {
    start: "top 90%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }),
  });
}

/* ------------------------------------------------------------------ accordions */

/*
 * Questions open with their height animating rather than snapping. Built on
 * `<details>`, so without this they still open and close; this only adds the
 * motion, and does nothing under reduced motion.
 */
function setUpAccordions(root: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => undefined;
  const items = qa<HTMLDetailsElement>(root, "details.faq__item");
  const handlers = items.map((item) => {
    const summary = q(item, "summary");
    const body = q(item, ".faq__answer");
    const onClick = (event: Event) => {
      if (!body) return;
      event.preventDefault();
      if (item.open) {
        const height = body.offsetHeight;
        body.animate([{ height: `${height}px`, opacity: 1 }, { height: "0px", opacity: 0 }], {
          duration: 260,
          easing: "cubic-bezier(0.7,0,0.84,0)",
        }).onfinish = () => {
          item.open = false;
        };
      } else {
        item.open = true;
        const height = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: `${height}px`, opacity: 1 }], {
          duration: 420,
          easing: "cubic-bezier(0.16,1,0.3,1)",
        });
      }
    };
    summary?.addEventListener("click", onClick);
    return () => summary?.removeEventListener("click", onClick);
  });
  return () => handlers.forEach((remove) => remove());
}
