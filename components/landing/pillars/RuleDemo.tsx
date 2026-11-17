"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionPathPlugin as MotionPathPluginType } from "gsap/MotionPathPlugin";
import BadgeAlertIcon from "lucide-react/dist/esm/icons/badge-alert.mjs";
import BadgeCheckIcon from "lucide-react/dist/esm/icons/badge-check.mjs";
import FileTextIcon from "lucide-react/dist/esm/icons/file-text.mjs";
import GitBranchIcon from "lucide-react/dist/esm/icons/git-branch.mjs";
import SendIcon from "lucide-react/dist/esm/icons/send.mjs";
import type { FeaturePillar } from "@/content/types";
import { type Director, type Gsap, loadGsap, TryHint, useAutoplay, useStill } from "./stage";
import styles from "./demos.module.css";

type Rule = NonNullable<FeaturePillar["ruleAnimation"]>;
type Route = "positive" | "negative";
type NodeIcon = typeof FileTextIcon;

const AMOUNTS: Record<Route, string> = { negative: "€2400", positive: "€499" };
const NODE_SHADOW = "0 12px 28px -18px rgba(16,24,40,0.42), 0 1px 2px rgba(16,24,40,0.05)";
/** The rule is drawn on its own 504 × 420 board; these are the edges between the nodes on it. */
const INPUT_PATH = "M 252 54 V 95";
const MIDDLE_PATH = "M 252 151 V 190";
const BRANCH_PATHS: Record<Route, string> = {
  negative: "M 252 246 C 252 306 372 306 372 342",
  positive: "M 252 246 C 252 306 132 306 132 342",
};
const COLORS: Record<Route, { solid: string; soft: string; ring: string; halo: string; logicBg: string; logicBorder: string }> = {
  negative: { halo: "rgba(245,158,11,0.18)", logicBg: "rgba(255,247,237,0.96)", logicBorder: "rgba(245,158,11,0.4)", ring: "rgba(245,158,11,0.55)", soft: "rgba(245,158,11,0.85)", solid: "#d97706" },
  positive: { halo: "rgba(16,185,129,0.16)", logicBg: "rgba(236,253,245,0.96)", logicBorder: "rgba(16,185,129,0.32)", ring: "rgba(16,185,129,0.52)", soft: "rgba(16,185,129,0.8)", solid: "#059669" },
};

let motionPathPromise: Promise<Gsap> | null = null;
function loadMotionPath() {
  motionPathPromise ??= Promise.all([loadGsap(), import("gsap/MotionPathPlugin")]).then(([gsap, module]) => {
    gsap.registerPlugin(module.MotionPathPlugin as typeof MotionPathPluginType);
    return gsap;
  });
  return motionPathPromise;
}

/**
 * An invoice runs through an approval rule: the amount is checked against the limit and
 * the invoice takes the branch that applies. Each run alternates between an amount under
 * the limit and one over it. The script sends both, one after the other.
 */
export function RuleDemo({ active, content, replay, tryLabel }: { active: boolean; content: Rule; replay: number; tryLabel: string }) {
  const still = useStill();
  const [running, setRunning] = useState(false);
  const [route, setRoute] = useState<Route>("positive");
  const [completed, setCompleted] = useState<Route | null>(null);
  const nextRouteRef = useRef<Route>("positive");
  const boardRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => () => void timelineRef.current?.kill(), []);

  const run = useCallback(async () => {
    const board = boardRef.current;
    if (!board) return;
    const current = nextRouteRef.current;
    nextRouteRef.current = current === "positive" ? "negative" : "positive";
    setRoute(current);
    // Without motion, the invoice simply lands where the rule sends it.
    if (still) {
      setCompleted(current);
      return;
    }
    setCompleted(null);
    setRunning(true);

    const gsap = await loadMotionPath();
    const el = <T extends Element = HTMLElement>(name: string) => board.querySelector<T>(`[data-rule="${name}"]`);
    const input = el<SVGPathElement>("input");
    const middle = el<SVGPathElement>("middle");
    const branch = el<SVGPathElement>("branch");
    const token = el("token");
    const core = el("core");
    const amount = el("amount");
    const logic = el("logic");
    const logicAmount = el("logic-amount");
    const operator = el("operator");
    const limit = el("limit");
    const startNode = el("node-start");
    const conditionNode = el("node-condition");
    const resultNode = el(`node-${current}`);
    if (!input || !middle || !branch || !token || !core || !amount || !logic || !logicAmount || !operator || !limit || !startNode || !conditionNode || !resultNode) {
      setRunning(false);
      return;
    }

    const color = COLORS[current];
    const branchPath = BRANCH_PATHS[current];
    branch.setAttribute("d", branchPath);
    amount.textContent = AMOUNTS[current];
    logicAmount.textContent = AMOUNTS[current];
    operator.textContent = current === "positive" ? "<" : ">";

    timelineRef.current?.kill();
    const nodes = Array.from(board.querySelectorAll<HTMLElement>("[data-rule^='node-']"));
    gsap.set([input, middle], { opacity: 0, stroke: "rgba(56,182,255,0.8)", strokeDashoffset: 1 });
    gsap.set(branch, { opacity: 0, stroke: color.soft, strokeDashoffset: 1 });
    gsap.set(nodes, { boxShadow: NODE_SHADOW, opacity: 0.55, scale: 1 });
    gsap.set(logic, { autoAlpha: 0, backgroundColor: "rgba(255,255,255,0.96)", borderColor: "rgba(16,24,40,0.14)", color: "#5a6373", scale: 0.96, y: 4 });
    gsap.set([logicAmount, operator, limit], { color: "#5a6373" });
    gsap.set(token, { autoAlpha: 0, scale: 0.72, x: 252, y: 54 });
    gsap.set(core, { autoAlpha: 1, backgroundColor: "var(--color-blue-soft)", boxShadow: "0 0 0 0 rgba(56,182,255,0)", scale: 1 });
    gsap.set(amount, { autoAlpha: 1, x: 0 });

    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    timelineRef.current = timeline;

    const travel = (path: SVGPathElement, d: string, duration: number) =>
      timeline
        .to(path, { duration: 0.06, opacity: 1 })
        .to(path, { duration, ease: "power1.inOut", strokeDashoffset: 0 }, "<")
        .to(token, { duration, motionPath: { autoRotate: false, path: d } }, "<");

    const arrive = (node: HTMLElement, halo = "rgba(56,182,255,0.2)") =>
      timeline
        .to(node, { boxShadow: `${NODE_SHADOW}, 0 0 0 4px ${halo}`, duration: 0.16, ease: "power2.out", opacity: 1, scale: 1.025 })
        .to(core, { boxShadow: `0 0 0 8px ${halo}`, duration: 0.08, ease: "power2.out", scale: 1.12 }, "<")
        .to(amount, { autoAlpha: 0, duration: 0.08, x: 3 }, "<")
        .to(core, { autoAlpha: 0, duration: 0.1, ease: "power2.in", scale: 0.28 })
        .to(node, { boxShadow: NODE_SHADOW, duration: 0.3, ease: "power3.out", scale: 1 }, "<");

    const leave = (x: number, y: number, background: string) =>
      timeline
        .set(token, { x, y })
        .set(core, { autoAlpha: 1, backgroundColor: background, boxShadow: "0 0 0 0 rgba(0,0,0,0)", scale: 0.34 })
        .set(amount, { autoAlpha: 0, x: -2 })
        .to(core, { duration: 0.12, ease: "back.out(2.2)", scale: 1 })
        .to(amount, { autoAlpha: 1, duration: 0.12, ease: "power2.out", x: 0 }, "<0.03");

    timeline.to(token, { autoAlpha: 1, duration: 0.18, ease: "power2.out", scale: 1 });
    travel(input, INPUT_PATH, 0.46);
    arrive(startNode);
    leave(252, 151, "var(--color-blue-soft)");
    travel(middle, MIDDLE_PATH, 0.42);
    arrive(conditionNode);

    // The check itself: the amount, the operator and the limit light up in turn, then the verdict.
    timeline
      .to(logic, { autoAlpha: 1, duration: 0.24, ease: "back.out(1.8)", scale: 1, y: 0 }, "+=0.02")
      .to(logicAmount, { color: "#101828", duration: 0.2 })
      .to(operator, { color: color.solid, duration: 0.2 }, "<0.1")
      .to(limit, { color: "#101828", duration: 0.2 }, "<0.1")
      .to(logic, { backgroundColor: color.logicBg, borderColor: color.logicBorder, color: color.solid, duration: 0.24 }, "+=0.2")
      .to(conditionNode, { boxShadow: `${NODE_SHADOW}, 0 0 0 3px ${color.ring}`, duration: 0.22 }, "<");

    leave(252, 246, color.solid);
    travel(branch, branchPath, 0.68);
    arrive(resultNode, color.halo);
    timeline.add(() => setCompleted(current));
    timeline.to([input, middle, branch], { duration: 0.35, opacity: 0.3 }, "+=0.35");
    timeline.to(token, { autoAlpha: 0, duration: 0.2 }, "<");

    await timeline;
    setRunning(false);
  }, [still]);

  const script = useCallback(async (director: Director) => {
    const button = boardRef.current?.querySelector("[data-rule='send']") ?? null;
    await director.click(button, () => void run());
    await director.wait(3600);
    await director.click(button, () => void run());
    await director.wait(3400);
  }, [run]);

  const reset = useCallback(() => {
    timelineRef.current?.kill();
    nextRouteRef.current = "positive";
    setRoute("positive");
    setCompleted(null);
    setRunning(false);
    const board = boardRef.current;
    if (!board) return;
    board.querySelectorAll<SVGPathElement>("[data-rule='input'], [data-rule='middle'], [data-rule='branch']").forEach((path) => (path.style.opacity = "0"));
    const token = board.querySelector<HTMLElement>("[data-rule='token']");
    if (token) token.style.opacity = "0";
    board.querySelectorAll<HTMLElement>("[data-rule^='node-']").forEach((node) => {
      node.style.boxShadow = "";
      node.style.opacity = "";
    });
    const logic = board.querySelector<HTMLElement>("[data-rule='logic']");
    if (logic) logic.style.visibility = "hidden";
  }, []);
  const finish = useCallback(() => undefined, []);
  const { phase, takeOver } = useAutoplay({ active, finish, replay, reset, script });

  return (
    <div className={styles.rule}>
      <div className={styles.ruleBoard} ref={boardRef}>
        <div aria-hidden="true" className={styles.ruleDots} />
        <button
          className={`${styles.sendButton} ${!running && phase !== "playing" ? styles.sendIdle : ""}`}
          data-rule="send"
          disabled={running}
          onClick={() => {
            takeOver();
            void run();
          }}
          tabIndex={-1}
          type="button"
        >
          <SendIcon strokeWidth={1.9} />
          {content.actionLabel}
          <TryHint className={styles.tryHintBelow} label={tryLabel} shown={phase === "handed-over" && !running} />
        </button>

        <svg className={styles.ruleSvg} viewBox="0 0 504 420">
          <path className={styles.ruleBase} d={INPUT_PATH} />
          <path className={styles.ruleBase} d={MIDDLE_PATH} />
          <path className={styles.ruleBase} d={BRANCH_PATHS.positive} />
          <path className={styles.ruleBase} d={BRANCH_PATHS.negative} />
          <path className={styles.ruleLive} d={INPUT_PATH} data-rule="input" pathLength={1} />
          <path className={styles.ruleLive} d={MIDDLE_PATH} data-rule="middle" pathLength={1} />
          <path className={styles.ruleLive} d={BRANCH_PATHS.positive} data-rule="branch" pathLength={1} />
        </svg>

        <div className={styles.token} data-rule="token">
          <span className={styles.tokenInner}>
            <span className={styles.tokenCore} data-rule="core"><span /></span>
            <span className={styles.tokenAmount} data-rule="amount">{AMOUNTS[route]}</span>
          </span>
        </div>

        <RuleNode icon={FileTextIcon} id="start" meta={content.start.meta} style={{ left: 143, top: 95, width: 218 }} title={content.start.title} />
        <RuleNode icon={GitBranchIcon} id="condition" meta={content.condition.meta} style={{ left: 139, top: 190, width: 226 }} title={content.condition.title}>
          <span className={styles.ruleLogic} data-rule="logic">
            <span data-rule="logic-amount">{AMOUNTS[route]}</span>
            <span data-rule="operator">&lt;</span>
            <span data-rule="limit">€1000</span>
          </span>
        </RuleNode>
        <RuleNode
          icon={BadgeCheckIcon}
          id="positive"
          meta={content.positive.meta}
          outcome={completed === "positive" ? content.positive.outcome : null}
          style={{ left: 14, top: 342, width: 236 }}
          title={content.positive.title}
          tone="green"
        />
        <RuleNode
          icon={BadgeAlertIcon}
          id="negative"
          meta={content.negative.meta}
          outcome={completed === "negative" ? content.negative.outcome : null}
          style={{ left: 254, top: 342, width: 236 }}
          title={content.negative.title}
          tone="amber"
        />
      </div>
    </div>
  );
}

function RuleNode({
  children,
  icon: Icon,
  id,
  meta,
  outcome = null,
  style,
  title,
  tone = "blue",
}: {
  children?: React.ReactNode;
  icon: NodeIcon;
  id: string;
  meta: string;
  outcome?: string | null;
  style: React.CSSProperties;
  title: string;
  tone?: "blue" | "green" | "amber";
}) {
  const toneClass = tone === "green" ? styles.toneGreen : tone === "amber" ? styles.toneAmber : styles.toneBlue;
  return (
    <div className={styles.ruleNode} data-done={outcome ? "" : undefined} data-rule={`node-${id}`} style={style}>
      <span className={`${styles.iconTile} ${toneClass}`}><Icon strokeWidth={1.7} /></span>
      <span className={styles.ruleNodeText}>
        <strong>{title}</strong>
        <small>{meta}</small>
      </span>
      {children}
      {outcome ? <span className={`${styles.outcome} ${toneClass}`}>{outcome}</span> : null}
    </div>
  );
}
