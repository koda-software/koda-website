"use client";

import { useEffect, useRef } from "react";

/*
 * The backdrop of every graphite opening scene: a faint map of a process.
 *
 * Stages sit on a loose grid, joined by right-angled connections the way the
 * process designer in Opero draws them, and a few records travel along those
 * connections from stage to stage. When one arrives, its stage lights up for
 * a moment and the record moves on. It is what the product does, drawn at the
 * volume of a watermark: never brighter than the copy, thinned out towards
 * the headline by a mask, and still when the reader asks for less motion.
 *
 * Canvas rather than SVG, because a hundred moving parts in the DOM cost more
 * than one bitmap, and it stops drawing whenever the scene is off screen or
 * the tab is hidden.
 */

type Node = { x: number; y: number; w: number; glow: number; out: number[] };
type Edge = { from: number; to: number; points: Array<[number, number]>; length: number };
type Token = { edge: number; at: number; speed: number };

const GRID = 132;
const NODE_H = 16;

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
  const nodes: Node[] = [];
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
        glow: 0,
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

  const tokens: Token[] = [];
  const count = Math.min(14, Math.round(edges.length / 4));
  for (let i = 0; i < count && edges.length; i++) {
    tokens.push({ edge: Math.floor(rnd() * edges.length), at: rnd(), speed: 34 + rnd() * 26 });
  }
  return { nodes, edges, tokens, rnd };
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
        node.glow = Math.max(0, node.glow - dt * 0.9);
        ctx.beginPath();
        ctx.roundRect(node.x - node.w / 2, node.y - NODE_H / 2, node.w, NODE_H, NODE_H / 2);
        ctx.fillStyle = `rgba(56, 182, 255, ${0.03 + node.glow * 0.16})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${node.glow > 0.02 ? "56, 182, 255" : "242, 245, 247"}, ${0.11 + node.glow * 0.5})`;
        ctx.stroke();
      }

      for (const token of map.tokens) {
        const edge = map.edges[token.edge];
        token.at += (dt * token.speed) / edge.length;
        if (token.at >= 1) {
          const node = map.nodes[edge.to];
          node.glow = 1;
          const next = node.out.length ? node.out[Math.floor(map.rnd() * node.out.length)] : Math.floor(map.rnd() * map.edges.length);
          token.edge = next;
          token.at = 0;
          continue;
        }
        const [x, y] = pointAt(edge, token.at);
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 14);
        halo.addColorStop(0, "rgba(56, 182, 255, 0.35)");
        halo.addColorStop(1, "rgba(56, 182, 255, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(56, 182, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
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

  return <canvas aria-hidden="true" className="flow-field" ref={ref} />;
}
