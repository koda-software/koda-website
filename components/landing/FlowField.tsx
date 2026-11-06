"use client";

import { useEffect, useRef } from "react";
import styles from "./FlowField.module.css";

/*
 * The backdrop of the home hero: a faint map of a process.
 *
 * Stages sit on a loose grid, joined by right-angled connections the way the
 * process designer in Opero draws them, and a few small signals travel along
 * those connections. A signal never jumps. It slows at the edge of a stage and
 * waits while the stage fills with power, then passes behind it and comes out of
 * the far side. A stage with nowhere to send it keeps the signal, and another
 * stage powers up and sends out a new one. It is what the product does, drawn at
 * the volume of a watermark: never brighter than the copy, thinned out towards
 * the headline by a mask, and still when the reader asks for less motion.
 *
 * Canvas rather than SVG, because a hundred moving parts in the DOM cost more
 * than one bitmap, and it stops drawing whenever the scene is off screen or
 * the tab is hidden.
 */

type Stage = { x: number; y: number; w: number; lit: number; fill: number; out: number[] };
type Edge = { from: number; to: number; points: Array<[number, number]>; length: number };
type Signal = {
  edge: number;
  at: number;
  speed: number;
  phase: "travel" | "charge" | "cross";
  /** The stage it is at, its place on that stage, and how far the charge has got. */
  node: number;
  x: number;
  clock: number;
  /** Where it leaves for, or null when the stage takes it in. */
  next: number | null;
};
type FlowMap = ReturnType<typeof build>;

const GRID = 132;
const NODE_H = 16;
const SIGNAL_RADIUS = 1.6;
const GLOW_RADIUS = 7;
/** Seconds a stage takes to power up, and how much quicker a signal crosses it than a line. */
const CHARGE = 0.5;
const CROSS_SPEED = 1.5;
/** How many pixels from a stage a signal starts to slow, and the share of its speed it arrives at. */
const SLOW_ZONE = 24;
const ARRIVAL_SPEED = 0.4;

/* A small seeded generator: the same map on every visit and every render. */
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function build(width: number, height: number) {
  const rnd = random(7);
  const cols = Math.ceil(width / GRID) + 1;
  const rows = Math.ceil(height / GRID) + 1;
  const nodes: Stage[] = [];
  const byCell = new Map<string, number>();

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      /* Denser on the right, where the screen sits and the copy does not. */
      const density = 0.18 + 0.42 * (c / cols);
      if (rnd() > density) continue;
      byCell.set(`${c}:${r}`, nodes.length);
      nodes.push({
        x: c * GRID + (rnd() - 0.5) * 30,
        y: r * GRID + (rnd() - 0.5) * 24,
        w: 34 + Math.round(rnd() * 3) * 10,
        lit: 0,
        fill: 0,
        out: [],
      });
    }
  }

  const edges: Edge[] = [];
  nodes.forEach((node, index) => {
    const c = Math.round(node.x / GRID);
    const r = Math.round(node.y / GRID);
    /* Every stage hands over to one or two stages in the next columns. */
    const targets: number[] = [];
    for (let dc = 1; dc <= 2 && targets.length < 2; dc++) {
      for (const dr of [0, -1, 1, 2, -2]) {
        const target = byCell.get(`${c + dc}:${r + dr}`);
        if (target !== undefined && !targets.includes(target) && rnd() < 0.75) targets.push(target);
        if (targets.length >= 1 + (rnd() < 0.35 ? 1 : 0)) break;
      }
    }
    for (const target of targets) {
      const a = nodes[index];
      const b = nodes[target];
      const x0 = a.x + a.w / 2;
      const x1 = b.x - b.w / 2;
      const mid = x0 + (x1 - x0) * (0.4 + rnd() * 0.2);
      const points: Array<[number, number]> = [
        [x0, a.y],
        [mid, a.y],
        [mid, b.y],
        [x1, b.y],
      ];
      let length = 0;
      for (let i = 1; i < points.length; i++) {
        length += Math.abs(points[i][0] - points[i - 1][0]) + Math.abs(points[i][1] - points[i - 1][1]);
      }
      a.out.push(edges.length);
      edges.push({ from: index, to: target, points, length });
    }
  });

  const signals: Signal[] = [];
  const count = Math.min(14, Math.round(edges.length / 4));
  for (let i = 0; i < count && edges.length; i++) {
    signals.push({
      edge: Math.floor(rnd() * edges.length),
      at: rnd(),
      speed: 34 + rnd() * 26,
      phase: "travel",
      node: 0,
      x: 0,
      clock: 0,
      next: null,
    });
  }
  return { nodes, edges, signals, rnd };
}

function pointAt(edge: Edge, t: number): [number, number] {
  let left = t * edge.length;
  for (let i = 1; i < edge.points.length; i++) {
    const [ax, ay] = edge.points[i - 1];
    const [bx, by] = edge.points[i];
    const seg = Math.abs(bx - ax) + Math.abs(by - ay);
    if (left <= seg || i === edge.points.length - 1) {
      const k = seg ? Math.min(1, left / seg) : 0;
      return [ax + (bx - ax) * k, ay + (by - ay) * k];
    }
    left -= seg;
  }
  return edge.points[edge.points.length - 1];
}

/* A new signal starts hidden inside a stage that has somewhere to send it. */
function send(map: FlowMap, signal: Signal) {
  const edge = Math.floor(map.rnd() * map.edges.length);
  const node = map.edges[edge].from;
  signal.edge = edge;
  signal.next = edge;
  signal.node = node;
  signal.x = map.nodes[node].x;
  signal.phase = "charge";
  signal.clock = 0;
}

function advance(map: FlowMap, signal: Signal, dt: number) {
  if (signal.phase === "travel") {
    const edge = map.edges[signal.edge];
    const left = (1 - signal.at) * edge.length;
    const pace = Math.min(1, ARRIVAL_SPEED + ((1 - ARRIVAL_SPEED) * left) / SLOW_ZONE);
    signal.at += (dt * signal.speed * pace) / edge.length;
    if (signal.at < 1) return;

    const node = map.nodes[edge.to];
    signal.phase = "charge";
    signal.node = edge.to;
    signal.x = node.x - node.w / 2;
    signal.clock = 0;
    signal.next = node.out.length ? node.out[Math.floor(map.rnd() * node.out.length)] : null;
    return;
  }

  const node = map.nodes[signal.node];
  if (signal.phase === "charge") {
    signal.clock = Math.min(1, signal.clock + dt / CHARGE);
    const power = signal.clock * (2 - signal.clock);
    node.lit = Math.max(node.lit, power);
    node.fill = Math.max(node.fill, power);
    if (signal.clock === 1) signal.phase = "cross";
    return;
  }

  node.lit = 1;
  signal.x += dt * signal.speed * CROSS_SPEED;
  if (signal.x < (signal.next === null ? node.x : node.x + node.w / 2)) return;
  if (signal.next === null) {
    send(map, signal);
    return;
  }
  signal.edge = signal.next;
  signal.at = 0;
  signal.phase = "travel";
}

function roundedPath(ctx: CanvasRenderingContext2D, points: Array<[number, number]>, radius: number) {
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    const r = Math.min(radius, Math.abs(ny - y) / 2 || radius, Math.abs(nx - x) / 2 || radius);
    ctx.arcTo(x, y, nx, ny, r);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last[0], last[1]);
}

export function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let map = build(1, 1);
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      map = build(width, height);
      draw(0);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(242, 245, 247, 0.075)";
      ctx.beginPath();
      for (const edge of map.edges) roundedPath(ctx, edge.points, 10);
      ctx.stroke();

      for (const node of map.nodes) {
        node.lit = Math.max(0, node.lit - dt * 0.9);
        if (!node.lit) node.fill = 0;
      }
      for (const signal of map.signals) advance(map, signal, dt);

      /* A small point with a slight glow, in the same blue the stages power up in. */
      for (const signal of map.signals) {
        const [x, y] =
          signal.phase === "travel"
            ? pointAt(map.edges[signal.edge], signal.at)
            : [signal.x, map.nodes[signal.node].y];
        const glow = ctx.createRadialGradient(x, y, SIGNAL_RADIUS, x, y, GLOW_RADIUS);
        glow.addColorStop(0, "rgba(56, 182, 255, 0.3)");
        glow.addColorStop(1, "rgba(56, 182, 255, 0)");
        ctx.beginPath();
        ctx.arc(x, y, GLOW_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, SIGNAL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(140, 200, 235, 0.8)";
        ctx.fill();
      }

      /* Stages are cut out of everything drawn so far, so a signal goes behind them, never over. */
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      for (const node of map.nodes) {
        ctx.roundRect(node.x - node.w / 2, node.y - NODE_H / 2, node.w, NODE_H, NODE_H / 2);
      }
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      for (const node of map.nodes) {
        const left = node.x - node.w / 2;
        const top = node.y - NODE_H / 2;
        ctx.beginPath();
        ctx.roundRect(left, top, node.w, NODE_H, NODE_H / 2);
        ctx.fillStyle = "rgba(56, 182, 255, 0.03)";
        ctx.fill();
        ctx.strokeStyle = "rgba(242, 245, 247, 0.11)";
        ctx.stroke();
        if (!node.lit) continue;

        /* The outline brightens while the power fills the stage from the side the signal reached. */
        ctx.strokeStyle = `rgba(56, 182, 255, ${node.lit * 0.5})`;
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(left, top, node.w * node.fill, NODE_H, NODE_H / 2);
        ctx.fillStyle = `rgba(56, 182, 255, ${node.lit * 0.22})`;
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      draw(dt);
      frame = visible && !document.hidden ? window.requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (still || frame || !visible || document.hidden) return;
      last = 0;
      frame = window.requestAnimationFrame(loop);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    seen.observe(canvas);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      observer.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", start);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas aria-hidden="true" className={styles.field} ref={ref} />;
}
